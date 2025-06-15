import {
  Bet,
  BetWithFixture,
  GetBetsResponse,
  GetBetsSchema,
  UserBetsFromFixtureIdsSchema,
} from '@f-stats-bets/types'
import { TAKE_LIMIT } from 'src/constants/constants'
import { db } from 'src/db'
import { rawQueryArray } from '../../lib'

export const getBets = async (input: GetBetsSchema): Promise<GetBetsResponse> => {
  const { userId, cursor, take } = input
  const takeInput = Number(take) || TAKE_LIMIT

  const bets = await rawQueryArray<BetWithFixture>(`
    SELECT 
      b.*,
      row_to_json(f.*) AS "Fixture",
      JSON_BUILD_OBJECT(
        'id', ht.id,
        'name', ht.name,
        'logo', ht.logo,
        'code', ht.code,
        'externalTeamId', ht."externalTeamId"
      ) AS "HomeTeam",
      JSON_BUILD_OBJECT(
        'id', at.id,
        'name', at.name,
        'logo', at.logo,
        'code', at.code,
        'externalTeamId', at."externalTeamId"
      ) AS "AwayTeam"
    FROM "Bet" b
    INNER JOIN "Fixture" f ON b."fixtureId" = f."fixtureId"
    INNER JOIN "Team" ht ON f."homeTeamId" = ht."id"
    INNER JOIN "Team" at ON f."awayTeamId" = at."id"
    WHERE b."userId" = '${userId}'
    ${cursor ? `AND b."betId" < '${cursor}'` : ''}
    ORDER BY b."createdAt" DESC, b."betId" DESC
    ${takeInput ? `LIMIT ${takeInput + 1}` : ''}
  `)

  const hasNextPage = bets.length > takeInput
  const items = hasNextPage ? bets.slice(0, takeInput) : bets
  const nextCursor = hasNextPage ? items[items.length - 1].betId : null

  return {
    items,
    nextCursor,
    count: items.length,
  }
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

export const getGlobalBetCompetitionId = async () => {
  const betCompetitionId = await db
    .selectFrom('BetCompetition')
    .where('isGlobal', '=', true)
    .select('betCompetitionId')
    .executeTakeFirst()

  return betCompetitionId?.betCompetitionId
}
