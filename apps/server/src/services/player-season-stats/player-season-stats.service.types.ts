import { PlayerFixtureStats } from '@f-stats-bets/types'

export type GroupKey = `${number}-${number}` // playerId-leagueId
export type GroupedStats = Record<GroupKey, PlayerFixtureStats[]>

export type AccumulatedStats = {
  appearences: number
  lineups: number
  captain: number
  substitute: number
  minutes: number
  rating: number
  eligibileAppearencesForRating: number
  substitutesIn: number
  substitutesBench: number
  goals: number
  assists: number
  conceded: number
  saves: number
  shotsTotal: number
  shotsOn: number
  passesTotal: number
  passesKey: number
  passesAccuracy: number
}

export type PerGameStats = {
  rating: number
  position: string
  eligibleForRanking: boolean
  minutesPerGame: number
  goalsAssists: number
  goalsPerGame: number
  goalsFrequency: number
  assistsPerGame: number
  assistsFrequency: number
  concededPerGame: number
  savesPerGame: number
  shotsTotalPerGame: number
  shotsOnPerGame: number
  passesTotalPerGame: number
  passesKeyPerGame: number
}
