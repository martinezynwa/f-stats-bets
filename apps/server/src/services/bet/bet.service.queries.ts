import { Bet, UserBetsSchema } from '@f-stats-bets/types'
import { rawQueryArray } from '../../lib'

export const getUserBets = async (input: UserBetsSchema) => {
  const { dateFrom, dateTo, userId } = input

  const bets = await rawQueryArray<Bet>(`
    SELECT * FROM "Bet"
    WHERE "userId" = '${userId}' 
    AND "createdAt"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date
  `)

  return bets
}
