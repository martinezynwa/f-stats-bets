import { Bet, BetCompetition, BetEvaluated, Fixture } from '../../database.types'
import { TeamDetailSimple } from '../fixture/fixture.types'

export interface GetBetsResponse {
  items: BetWithFixture[]
  nextCursor: string | null
  count: number
}

export type BetWithFixture = Bet & {
  BetEvaluated: BetEvaluated
  HomeTeam: TeamDetailSimple
  AwayTeam: TeamDetailSimple
  Fixture: Fixture
}

export type BetForEvaluation = {
  Bet: Bet
  BetCompetition: BetCompetition
  Fixture: Fixture
}
