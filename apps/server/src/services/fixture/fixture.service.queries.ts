import {
  FixturesBetsSchema,
  FixturesSchema,
  FixtureWithBet,
  FixtureWithTeamDetails,
} from '@f-stats-bets/types'
import { rawQueryArray } from '../../lib'

export const getFixturesWithBets = async (input: FixturesBetsSchema): Promise<FixtureWithBet[]> => {
  const { dateFrom, dateTo, leagueIds, season, userId, betCompetitionId } = input

  const fixtures = await rawQueryArray<FixtureWithBet>(`
    SELECT
      f.*,
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
      ) AS "AwayTeam",
      CASE 
        WHEN b."betId" IS NOT NULL THEN
          JSON_BUILD_OBJECT(
            'betId', b."betId",
            'fixtureResultBet', b."fixtureResultBet",
            'fixtureGoalsBet', b."fixtureGoalsBet",
            'fixtureScorersBet', b."fixtureScorersBet",
            'isEvaluated', b."isEvaluated",
            'oddValue', b."oddValue",
            'createdAt', b."createdAt",
            'updatedAt', b."updatedAt"
          )
        ELSE NULL
      END AS "Bet"
    FROM "Fixture" AS f
    LEFT JOIN "Team" AS ht ON f."homeTeamId" = ht.id
    LEFT JOIN "Team" AS at ON f."awayTeamId" = at.id
    LEFT JOIN "Bet" AS b ON f."fixtureId" = b."fixtureId" 
      AND b."userId" = '${userId}'
      AND b."betCompetitionId" = '${betCompetitionId}'
    WHERE f."date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date
    ${season ? `AND f."season" = ${Number(season)}` : ''}
    ${leagueIds?.length ? `AND f."leagueId" IN (${leagueIds.map(Number).join(',')})` : ''}
    ORDER BY f."date" ASC
  `)

  return fixtures
}

export const getFixtures = async (input: FixturesSchema) => {
  const { dateFrom, dateTo, leagueIds, season } = input

  const fixtures = await rawQueryArray<FixtureWithTeamDetails>(`
    SELECT
      f.*,
      JSON_BUILD_OBJECT(
        'id', ht.id,
        'name', ht.name,
        'logo', ht.logo,
        'code', ht.code,
        'teamId', ht."teamId"
      ) AS "homeTeam",
      JSON_BUILD_OBJECT(
        'id', at.id,
        'name', at.name,
        'logo', at.logo,
        'code', at.code,
        'teamId', at."teamId"
      ) AS "awayTeam"
    FROM "Fixture" AS f
    LEFT JOIN "Team" AS ht ON f."homeTeamId" = ht.id
    LEFT JOIN "Team" AS at ON f."awayTeamId" = at.id
    WHERE f."date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date
    ${season ? `AND f."season" = ${Number(season)}` : ''}
    ${leagueIds?.length ? `AND f."leagueId" IN (${leagueIds.map(Number).join(',')})` : ''}
    ORDER BY f."date" ASC
  `)

  return fixtures
}
