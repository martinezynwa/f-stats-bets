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
