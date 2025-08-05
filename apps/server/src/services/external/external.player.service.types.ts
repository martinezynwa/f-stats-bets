import { InsertPlayer, InsertPlayerToTeam } from '@f-stats-bets/types'

export type PlayerWithTeam = {
  teamId: number
  playerId: number
}

export type TransformPlayerResponsesOutput = {
  players: InsertPlayer[]
  playersToTeams: InsertPlayerToTeam[]
}
