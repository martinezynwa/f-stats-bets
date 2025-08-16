import { db } from '../../db'

export const getPlayers = async () => {
  const players = await db.selectFrom('Player').selectAll().execute()

  return players
}
