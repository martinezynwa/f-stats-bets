import { Bet, Fixture, League } from '../../database.types'

export type FixtureWithBet = {
  Bet: Bet
  Fixture: Fixture
  League: League
}

export type FixturesWithBets = Record<string, FixtureWithBet[]>
