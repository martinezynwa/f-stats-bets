import { InsertBetCompetition } from '@f-stats-bets/types'
import { db } from '../../db'

export const createBetCompetition = async (data: InsertBetCompetition) => {
  const betCompetition = await db
    .insertInto('BetCompetition')
    .values(data)
    .returningAll()
    .executeTakeFirstOrThrow()

  return betCompetition
}

export const deleteBetCompetition = async (betCompetitionId: string) => {
  const deleted = await db
    .deleteFrom('BetCompetition')
    .where('betCompetitionId', '=', betCompetitionId)
    .execute()

  return deleted
}

export const createBetCompetitionToLeague = async (
  betCompetitionId: string,
  leagueIds: string[],
) => {
  const values = leagueIds.map(leagueId => ({ betCompetitionId, leagueId }))

  const betCompetitionToLeague = await db
    .insertInto('BetCompetitionToLeague')
    // @ts-ignore TODO: fix this
    .values(values)
    .execute()

  return betCompetitionToLeague
}

export const createUserToBetCompetition = async (betCompetitionId: string, userIds: string[]) => {
  const values = userIds.map(userId => ({ betCompetitionId, userId }))

  const addedUserToBetCompetitionRelations = await db
    .insertInto('UserToBetCompetition')
    .values(values)
    .returningAll()
    .execute()

  return addedUserToBetCompetitionRelations
}
