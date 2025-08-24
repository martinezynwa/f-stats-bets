import { BetEvaluated, GetBetEvaluatedSchema } from '@f-stats-bets/types'
import { buildWhereClause, rawQueryArray } from '../../lib'

export const getBetsEvaluated = async (input: GetBetEvaluatedSchema) => {
  const { dateFrom, dateTo, betCompetitionId } = input

  const betsEvaluated = await rawQueryArray<BetEvaluated>(`
    SELECT be.* FROM "BetEvaluated" be
    INNER JOIN "Fixture" f ON be."fixtureId" = f."fixtureId"
    ${buildWhereClause(
      [
        dateFrom ? `f.date >= '${dateFrom}'` : null,
        dateTo ? `f.date <= '${dateTo}'` : null,
        betCompetitionId ? `be."betCompetitionId" = '${betCompetitionId}'` : null,
      ],
      'AND',
    )}
  `)

  return betsEvaluated
}
