import { CreateBetSchema, DeleteBetSchema, UpdateBetSchema } from '@f-stats-bets/types'
import { db } from '../../db'

export const createBet = async (input: CreateBetSchema) => {
  // @ts-ignore TODO
  const bet = await db.insertInto('Bet').values(input).returningAll().execute()

  return bet
}

export const deleteBet = async (input: DeleteBetSchema) => {
  const bet = await db.deleteFrom('Bet').where('betId', '=', input.betId).returningAll().execute()

  return bet
}

export const updateBet = async (input: UpdateBetSchema) => {
  const bet = await db
    .updateTable('Bet')
    .set({ fixtureResultBet: input.fixtureResultBet })
    .where('betId', '=', input.betId)
    .returningAll()
    .execute()

  return bet
}
