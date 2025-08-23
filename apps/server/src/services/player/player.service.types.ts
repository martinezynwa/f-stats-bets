import { PlayerFixtureStats } from '@f-stats-bets/types'

export type PlayerFixtureStatsSimple = Pick<PlayerFixtureStats, 'playerId' | 'teamId' | 'season'>

export interface GetPlayers {
  playerIds?: number[]
}

export interface GetPlayerToTeam {
  season?: number
  playerIds?: number[]
  isActual?: boolean
}

export interface GetPlayerStatus {
  playerIds: number[]
  isActive?: boolean
  isWithoutClub?: boolean
}
