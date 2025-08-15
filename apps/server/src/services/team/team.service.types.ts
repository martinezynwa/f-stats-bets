import { ExternalTeamResponse } from '../../types/external/external-team.types'

export interface InsertTeamToDbProps {
  leagueId: number
  season: number
  teamsData: ExternalTeamResponse[]
}

export interface PrepareTeamsDataProps {
  teamsData: ExternalTeamResponse[]
  season: number
  leagueId: number
}

export type GetTeamKeyProps = {
  teamId: number
  season: number
  leagueId: number
}
