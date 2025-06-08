import {
  FixtureWithBet,
  FixtureWithTeamDetails,
  FixturesBetsSchema,
  FixturesSchema,
  FixturesWithBets,
} from '@f-stats-bets/types'
import { rawQueryArray } from '../../lib'

export const getFixturesWithBets = async (input: FixturesBetsSchema): Promise<FixturesWithBets> => {
  const fixturesWithBets = await rawQueryArray<FixtureWithBet>(`
    SELECT json_build_object(
      'Bet', row_to_json(b.*),
      'Fixture', row_to_json(f.*),
      'League', row_to_json(l.*)
    ) as result
    FROM "Fixture" f
    LEFT JOIN "Bet" b ON f."fixtureId" = b."fixtureId"
    LEFT JOIN "League" l ON f."leagueId" = l."id"
    WHERE f."date"::date BETWEEN '${input.dateFrom}'::date AND '${input.dateTo}'::date
    ORDER BY l."name" ASC
  `)

  const data = fixturesWithBets.reduce((acc, curr) => {
    if (!acc[curr.League.id]) acc[curr.League.id] = []
    acc[curr.League.id].push(curr)
    return acc
  }, {} as FixturesWithBets)

  return data
}

export const getFixtures = async (input: FixturesSchema) => {
  const { dateFrom, dateTo, externalLeagueIds, season } = input

  const fixtures = await rawQueryArray<FixtureWithTeamDetails>(`
    SELECT
      f.*,
      JSON_BUILD_OBJECT(
        'id', ht.id,
        'name', ht.name,
        'logo', ht.logo,
        'code', ht.code,
        'externalTeamId', ht."externalTeamId"
      ) AS "homeTeam",
      JSON_BUILD_OBJECT(
        'id', at.id,
        'name', at.name,
        'logo', at.logo,
        'code', at.code,
        'externalTeamId', at."externalTeamId"
      ) AS "awayTeam"
    FROM "Fixture" AS f
    LEFT JOIN "Team" AS ht ON f."homeTeamId" = ht.id
    LEFT JOIN "Team" AS at ON f."awayTeamId" = at.id
    WHERE f."date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date
    ${season ? `AND f."season" = ${Number(season)}` : ''}
    ${externalLeagueIds?.length ? `AND f."externalLeagueId" IN (${externalLeagueIds.map(Number).join(',')})` : ''}
    ORDER BY f."date" ASC
  `)

  return fixtures
}
