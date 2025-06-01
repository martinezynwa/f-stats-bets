import { db } from 'src/db'

export const checkIsUsernameUsed = async (username: string) => {
  const user = await db
    .selectFrom('User')
    .selectAll()
    .where('name', '=', username)
    .executeTakeFirst()

  return !!user
}
