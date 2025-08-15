import { InitLeaguesValidationSchema } from '@f-stats-bets/types'
import { db } from '../../db'
import { fetchLeagueInfo } from './external.league.service'
import { insertLeagueToDb } from '../league/league.service.mutations'
import { fetchTeamsInfo } from './external.team.service'
import { insertTeamsToDb } from '../team/team.service.mutations'
import { fetchFixtures } from './external.fixture.service'
import { upsertFixtures } from '../fixture/fixture.service.mutations'

export const initLeagues = async (input: InitLeaguesValidationSchema) => {
  const { leagueIds, season } = input

  const leagues = await db
    .selectFrom('League')
    .select('leagueId')
    .where('leagueId', 'in', leagueIds)
    .execute()

  const seasonData = await db
    .selectFrom('Season')
    .selectAll()
    .where('seasonId', '=', season)
    .executeTakeFirst()

  const alreadyExistingLeagues = leagues?.map(league => league.leagueId) || []

  const leaguesToInsert = leagueIds.filter(id => !alreadyExistingLeagues.includes(id))

  for (const leagueId of leaguesToInsert) {
    const leagueData = await fetchLeagueInfo(leagueId, season)
    const league = await insertLeagueToDb({ leagueData, season })

    //TODO create LeagueToSeason

    const teamsData = await fetchTeamsInfo(leagueId, season)
    await insertTeamsToDb({
      leagueId,
      season,
      teamsData,
    })

    const externalFixturesData = await fetchFixtures({
      leagueIds,
      season,
      dateFrom: league?.dateStart || seasonData!.seasonStartDate,
      dateTo: league?.dateEnd || seasonData!.seasonEndDate,
    })

    await upsertFixtures(externalFixturesData, season)
  }

  return { leaguesInitialized: leaguesToInsert, leaguesAlreadyExisting: alreadyExistingLeagues }
}
