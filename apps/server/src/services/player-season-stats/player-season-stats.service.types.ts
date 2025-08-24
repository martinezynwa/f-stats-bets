import { PlayerFixtureStats, PlayerSeasonStats } from '@f-stats-bets/types'

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

export type PlayerSeasonStatsSingleGameKeys = keyof Pick<
  PlayerSeasonStats,
  | 'minutes'
  | 'goals'
  | 'assists'
  | 'conceded'
  | 'saves'
  | 'shotsTotal'
  | 'shotsOn'
  | 'passesTotal'
  | 'passesKey'
>

export type PlayerSeasonStatsPerGameStats = Pick<
  PlayerSeasonStats,
  | 'goalsFrequency'
  | 'assistsFrequency'
  | 'minutesPerGame'
  | 'goalsPerGame'
  | 'assistsPerGame'
  | 'concededPerGame'
  | 'savesPerGame'
  | 'shotsTotalPerGame'
  | 'shotsOnPerGame'
  | 'passesTotalPerGame'
  | 'passesKeyPerGame'
>

export const playerFixtureStatsKeys = [
  'id',
  'fixtureId',
  'playerId',
  'season',
  'leagueId',
  'teamId',
  'date',
  'minutes',
  'rating',
  'goals',
  'assists',
  'conceded',
  'saves',
  'shotsTotal',
  'shotsOn',
  'passesTotal',
  'passesKey',
  'passesAccuracy',
  'captain',
  'substitute',
  'position',
] as const

export const playerSeasonStatsFixedKeys = [
  'id',
  'playerId',
  'season',
  'leagueId',
  'teamId',
  'position',
] as const

export const playerSeasonStatsAdditionKeys = [
  'appearences',
  'eligibileAppearencesForRating',
  'lineups',
  'captain',
  'substitute',
  'minutes',
  'substitutesIn',
  'substitutesBench',
  'goals',
  'assists',
  'conceded',
  'saves',
  'shotsTotal',
  'shotsOn',
  'passesTotal',
  'passesKey',
  'passesAccuracy',
] as const

export const playerSeasonStatsAverageKeys = ['rating'] as const

export const playerSeasonStatsPerGameKeys = [
  'minutesPerGame',
  'goalsAssists',
  'goalsPerGame',
  'goalsFrequency',
  'assistsPerGame',
  'assistsFrequency',
  'concededPerGame',
  'savesPerGame',
  'shotsTotalPerGame',
  'shotsOnPerGame',
  'passesTotalPerGame',
  'passesKeyPerGame',
] as const

export const playerSeasonStatsOtherKeys = ['eligibleForRanking'] as const

export const allPlayerSeasonStatsKeys = [
  ...playerSeasonStatsFixedKeys,
  ...playerSeasonStatsAdditionKeys,
  ...playerSeasonStatsAverageKeys,
  ...playerSeasonStatsPerGameKeys,
  ...playerSeasonStatsOtherKeys,
]

export interface CreateAndInsertPlayerSeasonStatsInput {
  fixtureIds?: number[]
  playerFixtureStatsInput?: PlayerFixtureStats[]
}
