export const TAKE_LIMIT = 10
export const TABLE_PAGE_SIZE = 10
export const TOTAL_STATS_ID = '999999999'
export const TOTAL_STATS_ID_INT = 999999999
export const RANKING_ELIGIBILITY_THRESHOLD = 0.5
export const PLAYER_RATING_MINUTES_THRESHOLD = 20
export const SHOW_TOTAL_MATCHES_FORM = 5
export const PLAYER_NO_TEAM_ID = '0'
export const PLAYER_NO_TEAM_ID_INT = 0
export const API_CHUNK_SIZE = 20
export const PLAYER_TRANSFER_DATE_FROM_DAYS = 15
export const START_OF_DAY = '00:00:00'
export const END_OF_DAY = '23:59:59'

export const dummyRecord = {
  league: (season: number) => `${season}-0`,
  team: (season: number) => `${season}-00`,
}

export enum ORDERBY {
  GOALS = 'goals',
  ASSISTS = 'assists',
  RATING = 'rating',
}

export enum ORDER {
  DESC = 'desc',
  ASC = 'asc',
}

export enum LEAGUE_TYPE {
  'LEAGUE' = 'League',
  'CUP' = 'Cup',
  'ALL' = 'All',
}

export const CUP_ROUNDS = {
  'Preliminary Round': 100,
  'Preliminary Round Replays': 101,
  'Extra Preliminary Round': 102,
  'Extra Preliminary Round Replays': 103,
  '1st Round Qualifying': 104,
  '1st Round Qualifying Replays': 105,
  '2nd Round Qualifying': 106,
  '2nd Round Qualifying Replays': 107,
  '3rd Round Qualifying': 108,
  '3rd Round Qualifying Replays': 109,
  '4th Round Qualifying': 110,
  '4th Round Qualifying Replays': 111,

  '1st Round': 120,
  '1st Round Replays': 121,
  '2nd Round': 122,
  '2nd Round Replays': 123,
  '3rd Round': 124,
  '3rd Round Replays': 125,
  '4th Round': 126,
  '4th Round Replays': 127,
  '5th Round': 128,
  '5th Round Replays': 129,

  '1st Qualifying Round': 130,
  '2nd Qualifying Round': 131,
  '3rd Qualifying Round': 132,

  'Play-offs': 190,
  'Knockout Round Play-offs': 191,
  'Round of 16': 192,
  'Quarter-finals': 193,
  'Semi-finals': 194,
  '3rd Place Final': 195,
  Final: 196,
}

export const MATCH_LAST_TWO_NUMBERS = /\d{1,2}(?=[^\d]*$)/
export const UNKNOWN_NATIONALITY = 0
