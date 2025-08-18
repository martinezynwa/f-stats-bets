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

export const getGamesPlayedInLeagues = async (leagueIds: number[]) => {
  const gamesPlayed = await db
    .selectFrom('League')
    .where('League.leagueId', 'in', leagueIds)
    .select(['League.gamesPlayed', 'League.leagueId'])
    .execute()

  return gamesPlayed
}
