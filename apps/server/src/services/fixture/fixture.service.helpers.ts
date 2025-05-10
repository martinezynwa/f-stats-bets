import { InsertFixture, League, LeagueType } from '@f-stats-bets/types'
import { CUP_ROUNDS, MATCH_LAST_TWO_NUMBERS } from '../../constants/constants'
import { db } from '../../db'
import { ExternalFixtureResponse, FixtureStatus } from '../../types/external/external-fixture.types'
import { getLeagues } from '../league/league.service.queries'

export const prepareFixturesForInsertion = async (
  fixtures: ExternalFixtureResponse[],
  season: number,
) => {
  const leagues = await getLeagues()
  const leagueIds = leagues.map(l => l.id)

  const externalTeamIdsInFixtures = [
    ...new Set(fixtures.flatMap(f => [f.teams.away.id, f.teams.home.id])),
  ]

  const teams = await db
    .selectFrom('Team')
    .select(['externalTeamId', 'id', 'leagueId', 'externalLeagueId', 'name'])
    .where('leagueId', 'in', leagueIds)
    .where('externalTeamId', 'in', externalTeamIdsInFixtures)
    .where('season', '=', season)
    .execute()

  if (!teams || teams.length === 0) {
    throw new Error('No teams found')
  }

  const externalTeamIdsInDb = [...new Set(teams.map(team => team.externalTeamId))]
  const unsupportedTeams: number[] = externalTeamIdsInFixtures.filter(
    t => !externalTeamIdsInDb.includes(t),
  )

  const teamIdsMap = new Map(teams.map(t => [`${t.externalTeamId}-${t.externalLeagueId}`, t]))

  const fixturesToInsert: InsertFixture[] = fixtures
    .filter(
      fixture =>
        !unsupportedTeams.some(
          item => item === fixture.teams.home.id || item === fixture.teams.away.id,
        ),
    )
    .map(fixture => {
      const homeTeam = teamIdsMap.get(`${fixture.teams.home.id}-${fixture.league.id}`)!
      const awayTeam = teamIdsMap.get(`${fixture.teams.away.id}-${fixture.league.id}`)!
      const leagueId = homeTeam.leagueId

      const round = getFixtureRound(leagueId, leagues, fixture.league.round)

      const teamInfo = [
        { externalTeamId: homeTeam.externalTeamId, dbTeamId: homeTeam.id },
        { externalTeamId: awayTeam.externalTeamId, dbTeamId: awayTeam.id },
      ]

      const { awayTeamGoalsFinish, homeTeamGoalsFinish, teamIdWon } = getFixtureWinnerWithGoals(
        fixture,
        teamInfo,
      )

      return {
        leagueId,
        round,
        teamIdWon,
        homeTeamGoalsFinish,
        awayTeamGoalsFinish,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        fixtureId: fixture.fixture.id,
        externalLeagueId: fixture.league.id,
        season: fixture.league.season,
        date: fixture.fixture.date,
        homeTeamExternalId: fixture.teams.home.id,
        awayTeamExternalId: fixture.teams.away.id,
        status: fixture.fixture.status.short,
        venue: fixture.fixture?.venue.name,
        referee: fixture.fixture?.referee,
        elapsed: fixture.fixture.status?.elapsed,
        homeTeamGoalsHalf: fixture.score.halftime?.home,
        homeTeamGoalsExtra: fixture.score.extratime?.home,
        homeTeamGoalsPenalty: fixture.score.penalty?.home,
        awayTeamGoalsHalf: fixture.score.halftime?.away,
        awayTeamGoalsExtra: fixture.score.extratime?.away,
        awayTeamGoalsPenalty: fixture.score.penalty?.away,
      }
    })

  return fixturesToInsert
}

/**
 * Returns round number of a fixture
 */
export const getFixtureRound = (leagueId: string, leagues: League[], round: string) => {
  const league = leagues.find(l => l.id === leagueId)!
  const leagueType = league.type as LeagueType

  //TODO improve
  const matchedRound = round.match(MATCH_LAST_TWO_NUMBERS)?.[0] || undefined

  if (!matchedRound) {
    return 0
  }

  if (leagueType === LeagueType.LEAGUE) {
    //TODO handle playoff stages of certain leagues
    return parseInt(matchedRound)
  }

  if (leagueType === LeagueType.LEAGUE_CUP) {
    const groupStageRound =
      league.groupStage && (round.includes('Group') || round.includes('League Stage'))

    if (groupStageRound) {
      return parseInt(matchedRound)
    }

    return CUP_ROUNDS[round as keyof typeof CUP_ROUNDS] || 0
  }

  return 0
}

export const getFixtureWinner = (
  teams: ExternalFixtureResponse['teams'],
  teamInfo: { externalTeamId: number; dbTeamId: string }[],
) => {
  const winnerId = teams?.home?.winner ? teams.home?.id : teams?.away?.winner ? teams?.away?.id : ''

  const dbTeamId = teamInfo.find(team => team.externalTeamId === winnerId)?.dbTeamId

  return dbTeamId || null
}

export const getFixtureWinnerWithGoals = (
  fixture: ExternalFixtureResponse,
  teamInfo: { externalTeamId: number; dbTeamId: string }[],
) => {
  const fixtureStatus = fixture?.fixture?.status?.short
  const penalty = fixture?.score?.penalty
  const goals = fixture?.goals

  if (fixtureStatus === FixtureStatus.PENALTY) {
    return {
      teamIdWon: getFixtureWinner(fixture.teams, teamInfo),
      homeTeamGoalsFinish: penalty?.home > penalty?.away ? goals.home + 1 : goals.home,
      awayTeamGoalsFinish: penalty?.away > penalty?.home ? goals.away + 1 : goals.away,
    }
  }

  return {
    teamIdWon: getFixtureWinner(fixture.teams, teamInfo),
    homeTeamGoalsFinish: fixture.goals?.home,
    awayTeamGoalsFinish: fixture.goals?.away,
  }
}
