import { Bet, Fixture } from '../../database.types'
import { TeamDetailSimple } from '../fixture/fixture.types'

export interface GetBetsResponse {
  items: BetWithFixture[]
  nextCursor: string | null
  count: number
}

export type BetWithFixture = Bet & {
  HomeTeam: TeamDetailSimple
  AwayTeam: TeamDetailSimple
  Fixture: Fixture
}
