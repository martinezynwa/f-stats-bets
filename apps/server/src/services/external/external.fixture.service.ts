import { InsertFixturesValidationSchema } from '@f-stats-bets/types'
import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import { ExternalFixtureResponse } from '../../types/external/external-fixture.types'

/**
 * Fetch fixtures for multiple leagues
 * @dateFrom - YYYY-MM-DD format
 * @dateTo - YYYY-MM-DD format
 */
export const fetchFixtures = async (input: InsertFixturesValidationSchema) => {
  const { leagueIds, season, dateFrom, dateTo } = input

  const externalFixturesData: ExternalFixtureResponse[] = []

  for (const leagueId of leagueIds) {
    const fixturesOfLeague = await externalRequestHandler<ExternalFixtureResponse>({
      endpoint: ENDPOINTS.FIXTURES,
      params: {
        league: leagueId,
        season,
        from: dateFrom,
        to: dateTo,
      },
      responseArray: [],
    })

    externalFixturesData.push(...fixturesOfLeague)
  }

  return externalFixturesData
}
