type Birth = {
  date: string
  country: string
}

type Team = {
  id: number
  name: string
  logo: string
}

type League = {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
}

type Games = {
  appearences: number
  lineups: number
  minutes: number
  number: string
  position: string
  rating: string
  captain: boolean
}

type Substitutes = {
  in: number
  out: number
  bench: number
}

type Shots = {
  total: number
  on: number
}

type Goals = {
  total: number
  conceded: number
  assists: number
  saves: number
}

type Passes = {
  total: number
  key: number
  accuracy: number
}

type Tackles = {
  total: number
  blocks: number
  interceptions: number
}

type Duels = {
  total: number
  won: number
}

type Dribbles = {
  attempts: number
  success: number
  past: number
}

type Fouls = {
  drawn: number
  committed: number
}

type Cards = {
  yellow: number
  yellowred: number
  red: number
}

type Penalty = {
  won: number
  commited: number
  scored: number
  missed: number
  saved: number
}

export type Player = {
  id: number
  name: string
  firstname: string
  lastname: string
  age: number
  birth: Birth
  nationality: string
  height: string
  weight: string
  photo: string
}

type ExternalPlayerStatistics = {
  team: Team
  league: League
  games: Games
  substitutes: Substitutes
  shots: Shots
  goals: Goals
  passes: Passes
  tackles: Tackles
  duels: Duels
  dribbles: Dribbles
  fouls: Fouls
  cards: Cards
  penalty: Penalty
  offsides: number
}

export type ExternalPlayerInfoWithStatsResponse = {
  player: Player
  statistics: ExternalPlayerStatistics[]
}

export type ExternalPlayerInfoResponse = {
  player: Player
}

export type PlayerSquadDetail = {
  id: number
  name: string
  age: number
  number: number
  position: string
}

export type ExternalPlayerSquadsResponse = {
  team?: Team
  players?: PlayerSquadDetail[]
}

export type ExternalPlayersTeamsResponse = {
  team: Team
  seasons: number[]
}
