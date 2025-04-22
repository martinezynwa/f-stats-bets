import { RegisterUserInput } from '@f-stats-bets/types'
import { randomUUID } from 'crypto'
import { db } from 'src/db'

export const getAllUsers = async () => {
  return await db.selectFrom('User').selectAll().execute()
}

export const getUserById = async (id: string) => {
  return await db.selectFrom('User').selectAll().where('providerId', '=', id).executeTakeFirst()
}

export const createUser = async (data: { username: string }) => {
  return await db
    .insertInto('User')
    .values({
      ...data,
      id: randomUUID(),
    })
    .returningAll()
    .executeTakeFirst()
}

export const updateUser = async (id: string, data: { username?: string }) => {
  return await db
    .updateTable('User')
    .set(data)
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()
}

export const removeUser = async (id: string) => {
  return await db.deleteFrom('User').where('id', '=', id).returningAll().executeTakeFirst()
}

export const registerUser = async (data: RegisterUserInput) => {
  const user = await db
    .insertInto('User')
    .values({ ...data, id: randomUUID() }) //TODO fix once old data in db is deleted
    .returningAll()
    .executeTakeFirst()

  return user
}
