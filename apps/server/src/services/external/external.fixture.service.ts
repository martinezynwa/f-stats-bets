import { completedFixtureStatuses, InsertFixturesValidationSchema } from '@f-stats-bets/types'
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

/**
 * fetch completed(finished/cancelled) fixtures
 *
 * @season single season supported
 * @date single date supported
 * @fixtureIds so that only supported league IDs are filtered
 */
export const fetchCompletedFixtures = async (
  season: number,
  date: string,
  fixtureIds: number[],
) => {
  const fixtures = await externalRequestHandler<ExternalFixtureResponse>({
    endpoint: ENDPOINTS.FIXTURES,
    params: {
      season,
      date,
      status: completedFixtureStatuses.join('-'),
    },
    responseArray: [],
  })

  //unfortunately I cannot filter the requested fixtures at the API level
  //it did not return all data(bug I guess), so I am filtering here
  const filteredFixtures = fixtures.filter(fixture => fixtureIds.includes(fixture.fixture.id))

  return filteredFixtures
}
