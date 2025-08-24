import {
  FIXTURE_STATUS,
  FixtureStatus,
  InsertFixture,
  League,
  LeagueType,
} from '@f-stats-bets/types'
import { CUP_ROUNDS, MATCH_LAST_TWO_NUMBERS } from '../../constants/constants'
import { ExternalFixtureResponse } from '../../types/external/external-fixture.types'
import { getLeagues } from '../league/league.service.queries'
import { addHours, getCurrentDateAndTimeInDateFormat, isAfter } from 'src/lib/date-and-time'
import { CategorizedFixtures } from './fixture.service.types'

export const prepareFixturesForInsertion = async (
  fixtures: ExternalFixtureResponse[],
  season: number,
) => {
  const leagues = await getLeagues()

  const fixturesToInsert: InsertFixture[] = fixtures.map(fixture => {
    const leagueId = fixture.league.id

    const round = getFixtureRound(leagueId, leagues, fixture.league.round)

    const { awayTeamGoalsFinish, homeTeamGoalsFinish, teamIdWon } =
      getFixtureWinnerWithGoals(fixture)

    return {
      leagueId,
      round,
      teamIdWon,
      homeTeamGoalsFinish,
      awayTeamGoalsFinish,
      homeTeamId: fixture.teams.home.id,
      awayTeamId: fixture.teams.away.id,
      fixtureId: fixture.fixture.id,
      season: fixture.league.season,
      date: fixture.fixture.date,
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
export const getFixtureRound = (leagueId: number, leagues: League[], round: string) => {
  const league = leagues.find(l => l.leagueId === leagueId)!
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

export const getFixtureWinnerWithGoals = (fixture: ExternalFixtureResponse) => {
  const fixtureStatus = fixture?.fixture?.status?.short
  const penalty = fixture?.score?.penalty
  const goals = fixture?.goals

  const fixtureWinner = fixture.teams.home.winner
    ? fixture.teams.home.id
    : fixture.teams.away.winner
      ? fixture.teams.away.id
      : null

  if (fixtureStatus === FixtureStatus.PENALTY) {
    return {
      teamIdWon: fixtureWinner,
      homeTeamGoalsFinish: penalty?.home > penalty?.away ? goals.home + 1 : goals.home,
      awayTeamGoalsFinish: penalty?.away > penalty?.home ? goals.away + 1 : goals.away,
    }
  }

  return {
    teamIdWon: fixtureWinner,
    homeTeamGoalsFinish: fixture.goals?.home,
    awayTeamGoalsFinish: fixture.goals?.away,
  }
}

/**
 * Verify if any fixture of the day has started already
 *
 * @fixtureStartsAt UTC time - YYYY-MM-DDTHH:MM:SS+00:00
 */
export const checkFirstFixtureInPlay = (fixtureStartsAt: string) => {
  const fixtureStartDate = getCurrentDateAndTimeInDateFormat(fixtureStartsAt)
  const currentDateTimeDate = getCurrentDateAndTimeInDateFormat()

  const estimatedFixtureFinishDate = addHours(fixtureStartDate, 2)

  const hasFixtureFinished = isAfter(currentDateTimeDate, estimatedFixtureFinishDate)

  return {
    hasFixtureFinished,
    fixtureStartDate,
    currentDateTimeDate,
    estimatedFixtureFinishDate,
  }
}

/**
 * Categorize fixtures by their status from API
 */
export const categorizeFixturesByStatus = (fixtures: ExternalFixtureResponse[]) => {
  const fixturesCategorized = fixtures.reduce((acc, { fixture }) => {
    const category = Object.keys(FIXTURE_STATUS).find(key =>
      FIXTURE_STATUS[key as keyof typeof FIXTURE_STATUS].includes(fixture.status.short),
    )

    if (category) {
      acc[category as keyof CategorizedFixtures] = acc[category as keyof CategorizedFixtures] || []
      acc[category as keyof CategorizedFixtures].push(fixture.id)
    }

    return acc
  }, {} as CategorizedFixtures)

  const { cancelled, suspended, finished, notPlayed } = fixturesCategorized || {}

  const cancelledFixtureIds = [...(cancelled || []), ...(suspended || []), ...(notPlayed || [])]

  return { cancelledFixtureIds, finishedFixtureIds: finished }
}
