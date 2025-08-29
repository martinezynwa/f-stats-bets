import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import { ExternalTeamResponse } from '../../types/external/external-team.types'

export const fetchTeamsInfo = async (leagueId: number, season: number) => {
  const data = await externalRequestHandler<ExternalTeamResponse>({
    endpoint: ENDPOINTS.TEAMS,
    params: {
      league: leagueId,
      season,
    },
    responseArray: [],
  })

  return data
}

export const fetchTeamInfo = async (teamId: number) => {
  const data = await externalRequestHandler<ExternalTeamResponse>({
    endpoint: ENDPOINTS.TEAMS,
    params: { id: teamId },
    responseArray: [],
  })

  return data
}
