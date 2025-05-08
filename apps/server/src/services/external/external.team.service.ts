import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import { ExternalTeamResponse } from '../../types/external/external-team.types'

export const fetchTeamsInfo = async (externalLeagueId: number, season: number) => {
  const data = await externalRequestHandler<ExternalTeamResponse>({
    endpoint: ENDPOINTS.TEAMS,
    params: {
      league: externalLeagueId,
      season,
    },
    responseArray: [],
  })

  return data
}
