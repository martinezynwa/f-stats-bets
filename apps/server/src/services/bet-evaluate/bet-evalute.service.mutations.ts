import { BetForEvaluation, EvaluateBetsSchema, InsertBetEvaluated } from '@f-stats-bets/types'
import { db } from '../../db'
import { getBetsForEvaluation } from '../bet/bet.service.queries'
import { fixtureResultCheck } from './bet-evaluate.service.helpers'

export const evaluateBets = async (input: EvaluateBetsSchema) => {
  const { fixtureIds, dateFrom, dateTo } = input

  const bets = await getBetsForEvaluation({ dateFrom, dateTo, fixtureIds })

  if (!bets || bets.length === 0) {
    return []
  }

  const evaluatedBets = bets.map(bet => evaluateSingleBet(bet))

  const addedEvaluatedBets = await insertEvaluatedBets(evaluatedBets)

  const evaluatedBetIds = addedEvaluatedBets.map(bet => bet.betId)

  await markBetsAsEvaluated(evaluatedBetIds)

  return addedEvaluatedBets
}

export const evaluateSingleBet = (bet: BetForEvaluation) => {
  const { Bet, Fixture, BetCompetition } = bet
  const { fixtureResultBet, betId, userId, season } = Bet || {}

  const { homeTeamId, awayTeamId, teamIdWon, fixtureId } = Fixture

  const { fixtureResultPoints, betCompetitionId } = BetCompetition

  const isFixtureResultSuccess = fixtureResultBet
    ? fixtureResultCheck({
        fixtureResultBet,
        homeTeamId: homeTeamId.toString(),
        awayTeamId: awayTeamId.toString(),
        teamIdWon: teamIdWon?.toString() ?? null,
      })
    : undefined

  const evaluatedBet: InsertBetEvaluated = {
    betId,
    season,
    betCompetitionId,
    fixtureId,
    userId,
    fixtureResultPoints: fixtureResultBet
      ? isFixtureResultSuccess
        ? fixtureResultPoints
        : 0
      : null,
  }

  return evaluatedBet
}

export const insertEvaluatedBets = async (evaluatedBets: InsertBetEvaluated[]) => {
  const added = await db.insertInto('BetEvaluated').values(evaluatedBets).returningAll().execute()

  return added
}

export const markBetsAsEvaluated = async (betIds: string[]) => {
  const updated = await db
    .updateTable('Bet')
    .set({ isEvaluated: true })
    .where('betId', 'in', betIds)
    .execute()

  return updated
}
