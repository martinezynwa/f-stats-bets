import { db } from 'src/db'

export const getAllUsers = async () => {
  return await db.selectFrom('User').selectAll().execute()
}

export const getUserById = async (id: string) => {
  return await db.selectFrom('User').selectAll().where('providerId', '=', id).executeTakeFirst()
}

export const getUserSettings = async (userId: string) => {
  return await db
    .selectFrom('UserSettings')
    .selectAll()
    .where('userId', '=', userId)
    .executeTakeFirst()
}
