import {
  Bet,
  BetForEvaluation,
  BetWithFixture,
  FIXTURE_STATUS,
  GetBetsForEvaluationSchema,
  GetBetsResponse,
  GetBetsSchema,
  UserBetsFromFixtureIdsSchema,
} from '@f-stats-bets/types'
import { TAKE_LIMIT } from 'src/constants/constants'
import { rawQueryArray, rawQuerySingle } from '../../lib'

export const getBets = async (input: GetBetsSchema): Promise<GetBetsResponse> => {
  const { userId, cursor, take } = input
  const takeInput = Number(take) || TAKE_LIMIT

  const bets = await rawQueryArray<BetWithFixture>(`
    SELECT 
      b.*,
      row_to_json(f.*) AS "Fixture",
      row_to_json(be.*) AS "BetEvaluated",
      JSON_BUILD_OBJECT(
        'id', ht.id,
        'name', ht.name,
        'logo', ht.logo,
        'code', ht.code,
        'teamId', ht."teamId"
      ) AS "HomeTeam",
      JSON_BUILD_OBJECT(
        'id', at.id,
        'name', at.name,
        'logo', at.logo,
        'code', at.code,
        'teamId', at."teamId"
      ) AS "AwayTeam"
    FROM "Bet" b
    INNER JOIN "BetEvaluated" be ON b."betId" = be."betId"
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
  const betCompetitionId = await rawQuerySingle<{ betCompetitionId: string }>(`
    SELECT "betCompetitionId" 
    FROM "BetCompetition"
    WHERE "isGlobal" = true
    LIMIT 1
  `)

  return betCompetitionId?.betCompetitionId
}

/**
 * Gets bets for evaluation based on either date range or specific fixture IDs
 * @param input.dateFrom - Start date (required if fixtureIds not provided)
 * @param input.dateTo - End date (required if fixtureIds not provided)
 * @param input.fixtureIds - Array of fixture IDs in finished status to filter bets (required if dateFrom/dateTo not provided)
 */
export const getBetsForEvaluation = async (input: GetBetsForEvaluationSchema) => {
  const { dateFrom, dateTo, fixtureIds } = input

  const finishedFixtureStatuses = FIXTURE_STATUS.finished

  const bets = await rawQueryArray<BetForEvaluation>(`
    SELECT 
      row_to_json(b.*) AS "Bet",
      row_to_json(bc.*) AS "BetCompetition",
      row_to_json(f.*) AS "Fixture"
    FROM "Bet" b
    INNER JOIN "Fixture" f ON b."fixtureId" = f."fixtureId"
    INNER JOIN "BetCompetition" bc ON b."betCompetitionId" = bc."betCompetitionId"
    WHERE f."status" IN (${finishedFixtureStatuses.map(status => `'${status}'`).join(',')})
    ${dateFrom && dateTo ? `AND f."date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date` : ''}
    ${fixtureIds && fixtureIds.length > 0 ? `AND f."fixtureId" IN (${fixtureIds.map(id => `'${id}'`).join(',')})` : ''}
  `)

  return bets
}
