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
    short: string
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

export type ExternalH2HResponse = {
  fixture: Fixture
  league: League
  teams: {
    home: Team
    away: Team
  }
  goals: Goals
  score: Score
}
