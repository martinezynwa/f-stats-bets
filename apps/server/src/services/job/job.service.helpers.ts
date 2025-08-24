import { ExternalFixtureResponse } from '../../types/external/external-fixture.types'
import { FixtureDetail } from '../../types/external/external-player-fixture-stats.types'
import {
  fetchPlayersProfiles,
  transformPlayerProfileResponse,
} from '../external/external.player.service'
import { getLeagues } from '../league/league.service.queries'
import { fetchAndInsertPlayerFixtureStats } from '../player-fixture-stats/player-fixture-stats.service.mutations'
import { insertPlayers, insertPlayersToTeams } from '../player/player.service.mutations'
import { getPlayers } from '../player/player.service.queries'
import { Season } from '@f-stats-bets/types'
import { fetchFixtures } from '../external/external.fixture.service'
import { getCurrentDate } from '../../lib/date-and-time'
import { upsertFixtures } from '../fixture/fixture.service.mutations'
import { handleTransfers } from '../external/external.transfer.service'

/**
 * Create or update Player, PlayerToTeam, PlayerFixtureStats
 */
export const createPlayerDataFromFixtures = async (
  fixtureDetails: FixtureDetail[],
  season: number,
) => {
  const playerFixtureStats = await fetchAndInsertPlayerFixtureStats(fixtureDetails)

  const playerIds = playerFixtureStats.map(playerFixtureStat => playerFixtureStat.playerId)

  const existingPlayers = await getPlayers({ playerIds })

  const newPlayerIds = playerIds.filter(
    playerId => !existingPlayers.some(player => player.playerId === playerId),
  )

  if (newPlayerIds.length === 0) return { addedPlayers: [], addedPlayerToTeams: [] }

  const playerProfiles = await fetchPlayersProfiles(newPlayerIds)

  const playerProfileToInsert = transformPlayerProfileResponse(playerProfiles)

  const addedPlayers = await insertPlayers(playerProfileToInsert)

  const playerToTeamToInsert = playerProfileToInsert.map(player => ({
    playerId: player.playerId,
    teamId: playerFixtureStats.find(
      playerFixtureStat => playerFixtureStat.playerId === player.playerId,
    )?.teamId!,
    season,
    isActual: true,
  }))

  const addedPlayerToTeams = await insertPlayersToTeams(playerToTeamToInsert)

  return { addedPlayers, addedPlayerToTeams, playerFixtureStats }
}

/**
 * Update of db with new Fixture[]
 *
 * Update of existing Fixture with new date(if found)
 * @seasonData single season supported
 * @dateFrom since what date it should fetch fixture data from API
 */
export const handleFixtureUpdateAndAddition = async (seasonData: Season, dateFrom?: string) => {
  const { seasonId: season, seasonEndDate } = seasonData

  const leagues = await getLeagues(season)

  const externalFixtureData: ExternalFixtureResponse[] = []
  for (const league of leagues) {
    const externalFixtureData = await fetchFixtures({
      leagueIds: [league.leagueId],
      season,
      dateFrom: dateFrom ?? getCurrentDate(),
      dateTo: seasonEndDate,
    })

    externalFixtureData.push(...externalFixtureData)
  }

  // No new fixtures fetched
  if (externalFixtureData.length === 0) return

  const fixtures = await upsertFixtures(externalFixtureData, season)

  return fixtures
}

export const handlePlayerTransfers = async (season: number) => {
  await handleTransfers(season)
}
