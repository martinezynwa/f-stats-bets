type League = {
  id: number
  name: string
  type: string
  logo: string
}

type LeagueCountry = {
  name: string
  code: string
  flag: string
}

type LeagueSeasonDetails = {
  year: number
  start: string
  end: string
  current: boolean
}

export type ExternalLeagueResponse = {
  league: League
  country: LeagueCountry
  seasons: LeagueSeasonDetails[]
}

type Games = {
  played: number
  win: number
  draw: number
  lose: number
  goals: {
    for: number
    against: number
  }
}

export type LeagueStandingsTeam = {
  rank: number
  team: {
    id: number
    name: string
    logo: string
  }
  points: number
  goalDiff: number
  group: string
  form: string
  status: string
  description: string
  all: Games
  home: Games
  away: Games
  update: string
}

type LeagueStandingsResponse = LeagueStandingsTeam[]

type LeagueStandingsInfo = {
  id: number
  name: string
  country: string
  logo: string
  flag: string
  season: number
  standings: LeagueStandingsResponse[]
}

export type ExternalLeagueStandingsResponse = {
  league: LeagueStandingsInfo
}
