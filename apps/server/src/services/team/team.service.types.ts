import { ExternalTeamResponse } from '../../types/external/external-team.types'

export interface InsertTeamToDbProps {
  leagueId: string
  externalLeagueId: number
  season: number
  teamsData: ExternalTeamResponse[]
  nationIds?: number[]
  national?: boolean
}
