type Player = {
  id: number
  name: string
  photo: string
}

export type ExternalStatistics = {
  games: {
    minutes: number
    number: number
    position: string
    rating: string
    captain: boolean
    substitute: boolean
  }
  offsides: number
  shots: {
    total: number
    on: number
  }
  goals: {
    total: number
    conceded: number
    assists: number
    saves: number
  }
  passes: {
    total: number
    key: number
    accuracy: string
  }
  tackles: {
    total: number
    blocks: number
    interceptions: number
  }
  duels: {
    total: number
    won: number
  }
  dribbles: {
    attempts: number
    success: number
    past: number
  }
  fouls: {
    drawn: number
    committed: number
  }
  cards: {
    yellow: number
    red: number
  }
  penalty: {
    won: number
    commited: number
    scored: number
    missed: number
    saved: number
  }
}

type Team = {
  id: number
  name: string
  logo: string
  update: string
}

export type PlayerFixtureDetail = {
  player: Player
  statistics: ExternalStatistics[]
}

export interface ExternalPlayerFixtureStatisticsResponse {
  team?: Team
  players?: PlayerFixtureDetail[]
}

export type FixtureDetail = {
  date: string
  season: number
  fixtureId: number
  leagueId: string
  extLeagueId: number
  round: number
  homeTeamId?: string //db team ID
  awayTeamId?: string //db team ID
  homeTeamExtId: number
  awayTeamExtId: number
}

export interface CustomPlayerFixtureDetail {
  fixtureDetail: FixtureDetail
  response: ExternalPlayerFixtureStatisticsResponse[]
}
