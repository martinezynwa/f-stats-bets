import { FederationType, LeagueType, OrganizationType } from '@f-stats-bets/types'

export const getLeagueDetails = (externalLeagueId: number) => {
  return {
    type: '' as LeagueType,
    groupStage: false,
    supported: false,
    national: false,
    organization: '' as OrganizationType,
    federation: '' as FederationType,
  }
}
