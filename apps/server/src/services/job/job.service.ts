import { DailyDataUpdateSchema, RegularDataUpdateSchema } from '@f-stats-bets/types'
import { getCurrentDate } from '../../lib/date-and-time'
import { fetchCompletedFixtures } from '../external/external.fixture.service'
import {
  categorizeFixturesByStatus,
  checkFirstFixtureInPlay,
} from '../fixture/fixture.service.helpers'
import {
  updateFinishedFixtureData,
  updateFixtureStatus,
} from '../fixture/fixture.service.mutations'
import { getFixtures } from '../fixture/fixture.service.queries'
import { createAndInsertPlayerSeasonStats } from '../player-season-stats/player-season-stats.service.mutations'
import { getSeasons } from '../season/season.service.queries'
import {
  createPlayerDataFromFixtures,
  handleFixtureUpdateAndAddition,
  handlePlayerTransfers,
} from './job.service.helpers'

export const dailyDataUpdate = async (input?: DailyDataUpdateSchema) => {
  const seasons = await getSeasons({ isActual: true })

  await handleFixtureUpdateAndAddition(seasons[0])
  await handlePlayerTransfers(seasons[0].seasonId)
}

export const regularDataUpdate = async (input?: RegularDataUpdateSchema) => {
  const date = input?.selectedDate ?? getCurrentDate()
  const season = input?.season ?? (await getSeasons({ isActual: true }))[0].seasonId

  const fixturesOfSelectedDay = await getFixtures({
    dateFrom: `${date}T00:00:00+00:00`,
    dateTo: `${date}T23:59:59+00:00`,
    season: season.toString(),
  })

  // No fixtures for today
  if (fixturesOfSelectedDay.length === 0) return

  const { hasFixtureFinished } = checkFirstFixtureInPlay(fixturesOfSelectedDay[0]!.date)

  // No fixtures near their end
  if (!hasFixtureFinished) return

  const fixtureIdsOfSelectedDay = fixturesOfSelectedDay.map(fixture => fixture.fixtureId)

  const externalFixtureResponse = await fetchCompletedFixtures(
    season,
    date,
    fixtureIdsOfSelectedDay,
  )

  // No fixture in completed status
  if (externalFixtureResponse.length === 0) return

  const { cancelledFixtureIds, finishedFixtureIds } =
    categorizeFixturesByStatus(externalFixtureResponse)

  if (cancelledFixtureIds.length > 0) {
    const cancelledFixturesData = externalFixtureResponse.filter(({ fixture }) =>
      cancelledFixtureIds.includes(fixture.id),
    )

    await updateFixtureStatus(cancelledFixturesData)
  }

  // No fixture in finished status
  if (finishedFixtureIds?.length === 0) return

  const externalFinishedFixturesData = externalFixtureResponse.filter(({ fixture }) =>
    finishedFixtureIds.includes(fixture.id),
  )

  const updatedFixtures = await updateFinishedFixtureData(externalFinishedFixturesData)

  //  await updateManyFixtureRoundStatus(updatedFixtures)
  //  await updateManyLeaguesWithGamesPlayed(updatedFixtures)

  const fetchPlayerFixtureStatsInput = updatedFixtures.map(fixture => ({
    fixtureId: fixture.fixtureId,
    season: fixture.season,
    leagueId: fixture.leagueId,
    date: fixture.date,
  }))

  const { playerFixtureStats } = await createPlayerDataFromFixtures(
    fetchPlayerFixtureStatsInput,
    season,
  )

  await createAndInsertPlayerSeasonStats({ playerFixtureStatsInput: playerFixtureStats })
}
