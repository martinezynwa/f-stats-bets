import { TeamsValidationSchema } from '@f-stats-bets/types'
import { db } from '../../db'

export const getTeams = async (input: TeamsValidationSchema) => {
  const { leagueId, season } = input

  const teams = await db
    .selectFrom('Team')
    .selectAll()
    .where('leagueId', '=', leagueId)
    .where('season', '=', season)
    .execute()

  return teams
}
