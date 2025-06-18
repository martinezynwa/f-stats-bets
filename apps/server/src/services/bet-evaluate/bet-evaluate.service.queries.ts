import { BetEvaluated, GetBetEvaluatedSchema } from '@f-stats-bets/types'
import { rawQueryArray } from 'src/lib'

export const getBetsEvaluated = async (input: GetBetEvaluatedSchema) => {
  const { dateFrom, dateTo } = input

  const betsEvaluated = await rawQueryArray<BetEvaluated>(`
    SELECT be.* FROM "BetEvaluated" be
    INNER JOIN "Fixture" f ON be."fixtureId" = f."fixtureId"
    WHERE f.date >= '${dateFrom}' AND f.date <= '${dateTo}'
  `)

  return betsEvaluated
}
