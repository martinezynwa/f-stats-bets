import { CreateBetSchema, UpdateBetSchema } from '@f-stats-bets/types'
import { randomUUID } from 'crypto'
import { db } from 'src/db'

export const getAllBets = async () => {
  return await db.selectFrom('Bet').limit(10).selectAll().execute()
}

export const getBetById = async (id: string) => {
  const bet = await db.selectFrom('Bet').selectAll().where('id', '=', id).executeTakeFirst()

  return bet?.id
}

export const createBet = async (data: CreateBetSchema) => {
  return await db
    .insertInto('Bet')
    .values({
      ...data,
      id: randomUUID(),
      name: data.name,
    })
    .returningAll()
    .executeTakeFirst()
}

export const updateBet = async (input: UpdateBetSchema) => {
  const { id, ...data } = input

  return await db
    .updateTable('Bet')
    .set(data)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export const removeBet = async (id: string) => {
  return await db.deleteFrom('Bet').where('id', '=', id).returningAll().executeTakeFirst()
}
