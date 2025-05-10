import { ENDPOINTS } from '../constants/enums'
import { fixturesMock } from '../mock/fixture.mock'
import { isDateInRange } from './date-and-time'

interface MockHandlerProps {
  endpoint: ENDPOINTS
  params?: {
    league?: number
    season?: number
    from?: string
    to?: string
  }
}

export const mockHandler = (input: MockHandlerProps) => {
  const { endpoint, params } = input
  const { league, season, from, to } = params || {}

  switch (endpoint) {
    case ENDPOINTS.FIXTURES:
      return fixturesMock.filter(
        fixture =>
          (!league || fixture.league.id === league) &&
          (!season || fixture.league.season === season) &&
          isDateInRange(fixture.fixture.date, from, to),
      )
    default:
      return []
  }
}
