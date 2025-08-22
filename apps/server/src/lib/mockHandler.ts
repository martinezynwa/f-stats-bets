import { leaguesMock } from '../mock/league.mock'
import { teamsMock } from '../mock/team.mock'
import { ENDPOINTS } from '../constants/enums'
import { fixturesMock } from '../mock/fixture.mock'
import { isDateInRange } from './date-and-time'
import { playersProfilesMock, playersSquadsMock } from '../mock/player.mock'
import { playerFixtureStatsMock } from 'src/mock/playerFixtureStats.mock'
import { playersTeamsMock } from 'src/mock/playersTeams.mock'

interface MockHandlerProps {
  endpoint: ENDPOINTS
  params?: {
    league?: number
    season?: number
    from?: string
    to?: string
    player?: number
    id?: number
    team?: number
    fixture?: number
  }
}

export const mockHandler = (input: MockHandlerProps) => {
  const { endpoint, params } = input
  const { league, season, from, to, player, id, team, fixture } = params || {}

  switch (endpoint) {
    case ENDPOINTS.FIXTURES:
      return fixturesMock[season!][league!].filter(
        fixture =>
          (!league || fixture.league.id === league) &&
          (!season || fixture.league.season === season) &&
          isDateInRange(fixture.fixture.date, from, to),
      )
    case ENDPOINTS.LEAGUES:
      return leaguesMock[season!][id!] || []
    case ENDPOINTS.TEAMS:
      return teamsMock[season!][league!] || []
    case ENDPOINTS.PLAYERS_SQUADS:
      return playersSquadsMock[season!][team!] || []
    case ENDPOINTS.PLAYERS_PROFILES:
      return playersProfilesMock[player as keyof typeof playersProfilesMock] || []
    case ENDPOINTS.PLAYER_FIXTURE_STATS:
      return playerFixtureStatsMock
        .map(item => {
          if (item.fixtureDetail.fixtureId === fixture) {
            return item.response
          }
        })
        .filter(Boolean)
        .flat()
    case ENDPOINTS.PLAYERS_TEAMS:
      return playersTeamsMock[player!] || []
    default:
      return []
  }
}
