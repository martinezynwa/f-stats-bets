import { TeamsValidationSchema } from '@f-stats-bets/types'
import { db } from '../../db'

export const getTeams = async (input: TeamsValidationSchema) => {
  const { externalLeagueId, season } = input

  const teams = await db
    .selectFrom('Team')
    .selectAll()
    .where('externalLeagueId', '=', externalLeagueId)
    .where('season', '=', season)
    .execute()

  return teams
}
