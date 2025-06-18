import { BetResultType } from '@f-stats-bets/types'

export interface FixtureResultCheck {
  fixtureResultBet: BetResultType
  homeTeamId: string
  awayTeamId: string
  teamIdWon: string | null
}
