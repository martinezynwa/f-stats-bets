import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import {
  ExternalLeagueResponse,
  ExternalLeagueStandingsResponse,
} from '../../types/external/external-league.types'

export const fetchLeagueInfo = async (leagueId: number, season?: number) => {
  const data = await externalRequestHandler<ExternalLeagueResponse>({
    endpoint: ENDPOINTS.LEAGUES,
    params: {
      id: leagueId,
      season: season ?? undefined,
    },
    responseArray: [],
  })

  return data[0]!
}

export const fetchLeagueStandings = async (leagueId: number, season: number) => {
  const data = await externalRequestHandler<ExternalLeagueStandingsResponse>({
    endpoint: ENDPOINTS.STANDINGS,
    params: { league: leagueId, season },
    responseArray: [],
  })

  return data
}
