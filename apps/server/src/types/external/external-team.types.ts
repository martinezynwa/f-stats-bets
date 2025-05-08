type Team = {
  id: number
  name: string
  code: string
  country: string
  founded: number
  national: boolean
  logo: string
}

type TeamVenue = {
  id: number
  name: string
  address: string
  city: string
  capacity: number
  surface: string
  image: string
}

export type ExternalTeamResponse = {
  team: Team
  venue: TeamVenue
}

type FixtureTeamDetail = {
  home: number
  away: number
  total: number
}

type FixtureTeamDetailString = {
  home: string
  away: string
  total: string
}

type TotalAndPercentage = {
  total: number
  percentage: string
}

type HomeAway = {
  home: string
  away: string
}

export type ExternalTeamStatisticsResponse = {
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
    season: number
  }
  team: {
    id: number
    name: string
    logo: string
  }
  form: string
  fixtures: {
    played: FixtureTeamDetail
    wins: FixtureTeamDetail
    draws: FixtureTeamDetail
    loses: FixtureTeamDetail
  }
  goals: {
    for: {
      total: FixtureTeamDetail
      average: FixtureTeamDetailString
      minute: {
        '0-15': TotalAndPercentage
        '16-30': TotalAndPercentage
        '31-45': TotalAndPercentage
        '46-60': TotalAndPercentage
        '61-75': TotalAndPercentage
        '76-90': TotalAndPercentage
        '91-105': TotalAndPercentage
        '106-120': TotalAndPercentage
      }
    }
    against: {
      total: FixtureTeamDetail
      average: FixtureTeamDetailString
      minute: {
        '0-15': TotalAndPercentage
        '16-30': TotalAndPercentage
        '31-45': TotalAndPercentage
        '46-60': TotalAndPercentage
        '61-75': TotalAndPercentage
        '76-90': TotalAndPercentage
        '91-105': TotalAndPercentage
        '106-120': TotalAndPercentage
      }
    }
  }
  biggest: {
    streak: {
      wins: number
      draws: number
      loses: number
    }
    wins: HomeAway
    loses: HomeAway
    goals: {
      for: HomeAway
      against: HomeAway
    }
  }
  clean_sheet: FixtureTeamDetail
  failed_to_score: FixtureTeamDetail
  penalty: {
    scored: TotalAndPercentage
    missed: TotalAndPercentage
    total: number
  }
  lineups: {
    formation: string
    played: number
  }[]
  cards: {
    yellow: {
      '0-15': TotalAndPercentage
      '16-30': TotalAndPercentage
      '31-45': TotalAndPercentage
      '46-60': TotalAndPercentage
      '61-75': TotalAndPercentage
      '76-90': TotalAndPercentage
      '91-105': TotalAndPercentage
      '106-120': TotalAndPercentage
    }
    red: {
      '0-15': TotalAndPercentage
      '16-30': TotalAndPercentage
      '31-45': TotalAndPercentage
      '46-60': TotalAndPercentage
      '61-75': TotalAndPercentage
      '76-90': TotalAndPercentage
      '91-105': TotalAndPercentage
      '106-120': TotalAndPercentage
    }
  }
}
