import { db } from '../../db'

export const getTeams = async () => {
  const teams = await db.selectFrom('Team').selectAll().execute()
  return teams
}
