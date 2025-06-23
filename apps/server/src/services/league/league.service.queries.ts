import { LeagueType } from '@f-stats-bets/types'
import { db } from 'src/db'

export const getLeagues = async () => {
  const leagues = await db
    .selectFrom('League')
    .where('League.type', 'not in', [LeagueType.UNASSIGNED, LeagueType.TOTALS])
    .selectAll()
    .orderBy('League.name')
    .execute()

  return leagues
}
