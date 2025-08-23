type Birth = {
  date: string
  country: string
  place: string
}

type Team = {
  id: number
  name: string
  logo: string
}

type League = {
  id: number | null
  name: string | null
  country: string | null
  logo: string | null
  flag: string | null
  season: number | null
}

type Games = {
  appearences: number | null
  lineups: number | null
  minutes: number | null
  number: string | null
  position: string | null
  rating: string | null
  captain: boolean | null
}

type Substitutes = {
  in: number | null
  out: number | null
  bench: number | null
}

type Shots = {
  total: number | null
  on: number | null
}

type Goals = {
  total: number | null
  conceded: number | null
  assists: number | null
  saves: number | null
}

type Passes = {
  total: number | null
  key: number | null
  accuracy: number | null
}

type Tackles = {
  total: number | null
  blocks: number | null
  interceptions: number | null
}

type Duels = {
  total: number | null
  won: number | null
}

type Dribbles = {
  attempts: number | null
  success: number | null
  past: number | null
}

type Fouls = {
  drawn: number | null
  committed: number | null
}

type Cards = {
  yellow: number | null
  yellowred: number | null
  red: number | null
}

type Penalty = {
  won: number | null
  commited: number | null
  scored: number | null
  missed: number | null
  saved: number | null
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
  injured: boolean
}

export type ExternalPlayerStatistics = {
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
  offsides?: number
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

export type ExternalPlayersTeamsResponseWithPlayerId = {
  playerId: number
  response: ExternalPlayersTeamsResponse[]
}
