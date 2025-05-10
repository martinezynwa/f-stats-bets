import { ExternalLeagueResponse } from '../../types/external/external-league.types'

export interface InsertLeagueToDbProps {
  leagueData: ExternalLeagueResponse
  season: number
}
