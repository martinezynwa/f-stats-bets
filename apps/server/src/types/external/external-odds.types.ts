export enum BookmakerId {
  BET365 = 8,
}

type Fixture = {
  id: number
  timezone: string
  date: string
  timestamp: number
}

type League = {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
}

export enum BetType {
  MATCH_WINNER = 'Match Winner',
  EXACT_SCORE = 'Exact Score',
}

export type ExternalBetValue = {
  value: string
  odd: string
}

export type ExternalBet = {
  id: string
  name: BetType
  values: ExternalBetValue[]
}

type OddBookmakerValues = {
  id: number
  name: string
  bets: ExternalBet[]
}

export type ExternalOddsResponse = {
  fixture: Fixture
  league: League
  update: string
  bookmakers: OddBookmakerValues[]
}

export type ExternalBetValueWithGoals = ExternalBetValue & { totalGoals: number }
