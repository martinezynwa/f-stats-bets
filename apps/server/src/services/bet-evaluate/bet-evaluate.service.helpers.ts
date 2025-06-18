import { BetResultType } from '@packages/types/dist'
import { FixtureResultCheck } from './bet-evaluate.service.types'

export const fixtureResultCheck = (input: FixtureResultCheck) => {
  const { fixtureResultBet, homeTeamId, awayTeamId, teamIdWon } = input

  if (fixtureResultBet === BetResultType.HOME_WIN) return homeTeamId === teamIdWon
  if (fixtureResultBet === BetResultType.AWAY_WIN) return awayTeamId === teamIdWon
  if (fixtureResultBet === BetResultType.DRAW) return !teamIdWon
}
