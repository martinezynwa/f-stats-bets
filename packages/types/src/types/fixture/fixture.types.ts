import { Bet, Fixture, Team } from '../../database.types'

export type TeamDetailSimple = Pick<Team, 'teamId' | 'name' | 'logo' | 'code'>

type TeamsInfo = {
  HomeTeam: TeamDetailSimple
  AwayTeam: TeamDetailSimple
}

export type FixtureWithTeamDetails = Fixture & TeamsInfo

export type FixtureWithBet = Fixture &
  TeamsInfo & {
    Bet: Bet | undefined
  }

export enum FixtureStatus {
  TBD = 'TBD',
  NOT_STARTED = 'NS',
  FIRST_HALF = '1H',
  HALF_TIME = 'HT',
  SECOND_HALF = '2H',
  EXTRA_TIME = 'ET',
  BREAK_TIME = 'BT',
  PENALTY_IN_PROGRESS = 'P',
  LIVE = 'LIVE',
  CANCELLED = 'CANC',
  POSTPONED = 'PST',
  SUSPENDED = 'SUSP',
  ABANDONED = 'ABD',
  SUSPENDED_INT = 'INT',
  FINISHED = 'FT',
  AFTER_EXTRA_TIME = 'AET',
  PENALTY = 'PEN',
  TECHNICAL_LOSS = 'AWD',
  WALKOVER = 'WO',
}

export const FIXTURE_STATUS = {
  noInfo: [FixtureStatus.TBD],
  planned: [FixtureStatus.NOT_STARTED],
  inProgress: [
    FixtureStatus.FIRST_HALF,
    FixtureStatus.HALF_TIME,
    FixtureStatus.SECOND_HALF,
    FixtureStatus.EXTRA_TIME,
    FixtureStatus.BREAK_TIME,
    FixtureStatus.PENALTY_IN_PROGRESS,
    FixtureStatus.LIVE,
  ],
  cancelled: [
    FixtureStatus.SUSPENDED,
    FixtureStatus.POSTPONED,
    FixtureStatus.CANCELLED,
    FixtureStatus.ABANDONED,
  ],
  suspended: [FixtureStatus.SUSPENDED_INT],
  finished: [FixtureStatus.FINISHED, FixtureStatus.AFTER_EXTRA_TIME, FixtureStatus.PENALTY],
  notPlayed: [FixtureStatus.TECHNICAL_LOSS, FixtureStatus.WALKOVER],
}

export const FIXTURE_OVERTIME_STATUS = [FixtureStatus.AFTER_EXTRA_TIME, FixtureStatus.PENALTY]

export const inProgressFixtureStatuses = [...FIXTURE_STATUS.inProgress]

export const unplayedFixtureStatuses = [
  ...FIXTURE_STATUS.noInfo,
  ...FIXTURE_STATUS.planned,
  ...FIXTURE_STATUS.cancelled,
  ...FIXTURE_STATUS.suspended,
  ...FIXTURE_STATUS.notPlayed,
]

export const incompletedFixtureStatuses = [
  ...FIXTURE_STATUS.noInfo,
  ...FIXTURE_STATUS.planned,
  ...FIXTURE_STATUS.inProgress,
  ...FIXTURE_STATUS.suspended,
]

export const completedFixtureStatuses = [
  ...FIXTURE_STATUS.cancelled,
  ...FIXTURE_STATUS.finished,
  ...FIXTURE_STATUS.notPlayed,
]

export enum FIXTURE_STATUS_CODE {
  'FIN' = 'Finished',
  'PRG' = 'In progress',
  'CAN' = 'Cancelled',
  'CHE' = 'Check again later',
}
