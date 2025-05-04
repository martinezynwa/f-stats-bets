import { db } from 'src/db'

export const getLeagues = async () => {
  const leagues = await db.selectFrom('League').selectAll().execute()

  return leagues
}
