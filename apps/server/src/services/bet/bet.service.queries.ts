import { Bet, UserBetsFromFixtureIdsSchema, UserBetsSchema } from '@f-stats-bets/types'
import { rawQueryArray } from '../../lib'

export const getUserBets = async (input: UserBetsSchema) => {
  const { dateFrom, dateTo, userId } = input

  const bets = await rawQueryArray<Bet>(`
    SELECT b.* FROM "Bet" b
    INNER JOIN "Fixture" f ON b."fixtureId" = f."fixtureId"
    WHERE b."userId" = '${userId}' 
    AND f."date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date
  `)

  return bets
}

export const getUserBetsFromFixtureIds = async (input: UserBetsFromFixtureIdsSchema) => {
  const { dateFrom, dateTo, userId, betCompetitionId } = input

  const bets = await rawQueryArray<Bet>(`
    SELECT b.* FROM "Bet" b
    INNER JOIN "Fixture" f ON b."fixtureId" = f."fixtureId"
    WHERE b."userId" = '${userId}' 
    AND f."date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date
    ${betCompetitionId ? `AND b."betCompetitionId" = '${betCompetitionId}'` : ''}
  `)

  return bets
}
