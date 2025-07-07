import { BetCompetition } from '../../database.types'
import { z } from 'zod'

export type BetCompetitionWithLeagues = BetCompetition & {
  leagueIds: string[]
}

export type BetCompetitionStandings = {
  userId: string
  userName: string
  position: number
  points: number
}

export type BetCompetitionStandingsResponse = {
  items: BetCompetitionStandings[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
}

export type BetEvaluatedWithPoints = {
  fixtureResultPoints?: number
  fixtureGoalsPoints?: number
  fixtureHomeGoalsPoints?: number
  fixtureAwayGoalsPoints?: number
  fixtureScorersPoints?: number
  fixtureScorersIncorrect?: number
  fixtureScorersCorrect?: number
}
