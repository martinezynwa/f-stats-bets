import { League, LeagueType } from '@f-stats-bets/types'
import { db } from 'src/db'
import { buildWhereClause, rawQueryArray } from 'src/lib'

export const getLeagues = async (season?: number) => {
  const leagues = await rawQueryArray<League>(
    `SELECT * FROM "League" 
    ${buildWhereClause(
      [
        season ? `League.season = ${season}` : null,
        `League.type not in (${LeagueType.UNASSIGNED}, ${LeagueType.TOTALS})`,
      ],
      'AND',
    )}
    ORDER BY "League"."name"
    `,
  )

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
