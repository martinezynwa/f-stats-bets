import { FixtureStatus } from '@f-stats-bets/types'

type Fixture = {
  id: number
  referee: string
  timezone: string
  date: string
  timestamp: number
  periods: {
    first: number
    second: number
  }
  venue: {
    id: number
    name: string
    city: string
  }
  status: {
    long: string
    short: FixtureStatus
    elapsed: number
  }
}

type League = {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
  round: string
}

type Team = {
  id: number
  name: string
  logo: string
  winner: boolean
}

type Goals = {
  home: number
  away: number
}

type Score = {
  halftime: Goals
  fulltime: Goals
  extratime: Goals
  penalty: Goals
}

export enum EventType {
  Goal = 'Goal',
  Substitution = 'Substitution',
  Penalty = 'Penalty',
  Subst = 'subst',
  Card = 'Card',
  Var = 'Var',
}

export enum EventDetail {
  NormalGoal = 'Normal Goal',
  Penalty = 'Penalty',
  OwnGoal = 'Own Goal',
  Substitution1 = 'Substitution 1',
  Substitution2 = 'Substitution 2',
  Substitution3 = 'Substitution 3',
  Substitution4 = 'Substitution 4',
  Substitution5 = 'Substitution 5',
  YellowCard = 'Yellow Card',
  RedCard = 'Red Card',
  CardUpgrade = 'Card upgrade',
  PenaltyCancelled = 'Penalty cancelled',
  PenaltyMissed = 'Missed Penalty',
  GoalCancelled = 'Goal cancelled',
}

export enum EventComment {
  PenaltyShootout = 'Penalty Shootout',
}

export type ExternalFixtureEvent = {
  time: {
    elapsed: number
    extra: number
  }
  team: Omit<Team, 'winner'>
  player: {
    id: number
    name: string
  }
  assist: {
    id: number
    name: string
  }
  type: EventType
  detail: EventDetail
  comments: EventComment
}

export type ExternalFixtureResponse = {
  fixture: Fixture
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: Goals
  score: Score
  events: ExternalFixtureEvent[]
}
