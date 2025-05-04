import { FixtureWithBet, FixturesBetsSchema, FixturesWithBets } from '@f-stats-bets/types'
import { rawQueryArray } from 'src/lib'

export const getFixturesWithBets = async (
  params: FixturesBetsSchema,
): Promise<FixturesWithBets> => {
  const fixturesWithBets = await rawQueryArray<FixtureWithBet>(`
    SELECT json_build_object(
      'Bet', row_to_json(b.*),
      'Fixture', row_to_json(f.*),
      'League', row_to_json(l.*)
    ) as result
    FROM "Fixture" f
    LEFT JOIN "Bet" b ON f."fixtureId" = b."fixtureId"
    LEFT JOIN "League" l ON f."leagueId" = l."id"
    WHERE f."date"::date BETWEEN '${params.dateFrom}'::date AND '${params.dateTo}'::date
    ORDER BY l."name" ASC
  `)

  const data = fixturesWithBets.reduce((acc, curr) => {
    if (!acc[curr.League.id]) acc[curr.League.id] = []
    acc[curr.League.id].push(curr)
    return acc
  }, {} as FixturesWithBets)

  return data
}
