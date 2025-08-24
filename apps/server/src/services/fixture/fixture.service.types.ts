import { FIXTURE_STATUS } from '@f-stats-bets/types'

export type FixtureDetailWithRound = {
  fixtureId: number
  leagueId: number
  season: number
  round: number
  date: string
}

export interface FixtureSearchProps {
  dateFrom?: string
  dateTo?: string
  season?: number
  leagueIds?: number[]
}

export type CategorizedFixtures = {
  [K in keyof typeof FIXTURE_STATUS]: number[]
}
