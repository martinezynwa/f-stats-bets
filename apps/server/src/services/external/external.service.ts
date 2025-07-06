import { InitLeaguesValidationSchema } from '@f-stats-bets/types'
import { db } from '../../db'
import { fetchLeagueInfo } from './external.league.service'
import { insertLeagueToDb } from '../league/league.service.mutations'
import { fetchTeamsInfo } from './external.team.service'
import { insertTeamsToDb } from '../team/team.service.mutations'
import { fetchFixtures } from './external.fixture.service'
import { upsertFixtures } from '../fixture/fixture.service.mutations'

export const initLeagues = async (input: InitLeaguesValidationSchema) => {
  const { externalLeagueIds, season } = input

  const leagues = await db
    .selectFrom('League')
    .select('League.externalLeagueId')
    .where('externalLeagueId', 'in', externalLeagueIds)
    .where('season', '=', season)
    .execute()

  const seasonData = await db
    .selectFrom('Season')
    .selectAll()
    .where('seasonId', '=', season)
    .executeTakeFirst()

  const alreadyExistingLeagues = leagues?.map(league => league.externalLeagueId) || []

  const leaguesToInsert = externalLeagueIds.filter(id => !alreadyExistingLeagues.includes(id))

  for (const externalLeagueId of leaguesToInsert) {
    const leagueData = await fetchLeagueInfo(externalLeagueId, season)
    const league = await insertLeagueToDb({ leagueData, season })

    const teamsData = await fetchTeamsInfo(externalLeagueId, season)
    await insertTeamsToDb({
      leagueId: league!.id,
      externalLeagueId,
      season,
      teamsData,
    })

    const externalFixturesData = await fetchFixtures({
      externalLeagueIds,
      season,
      dateFrom: league?.dateStart || seasonData!.seasonStartDate,
      dateTo: league?.dateEnd || seasonData!.seasonEndDate,
    })

    await upsertFixtures(externalFixturesData, season)
  }

  return { leaguesInitialized: leaguesToInsert, leaguesAlreadyExisting: alreadyExistingLeagues }
}
