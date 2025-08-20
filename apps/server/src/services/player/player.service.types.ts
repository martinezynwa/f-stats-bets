import { PlayerFixtureStats } from '@f-stats-bets/types'

export type PlayerFixtureStatsSimple = Pick<PlayerFixtureStats, 'playerId' | 'teamId' | 'season'>

export interface GetPlayers {
  playerIds?: number[]
}
