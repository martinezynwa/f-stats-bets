import { GetPlayerSeasonStatsSchema, PlayerSeasonStats } from '@f-stats-bets/types'
import { buildWhereClause, rawQueryArray } from '../../lib'

export const getPlayerSeasonStats = async (input: GetPlayerSeasonStatsSchema) => {
  const { season, leagueIds, playerIds } = input

  const data = await rawQueryArray<PlayerSeasonStats>(`
    SELECT * FROM "PlayerSeasonStats"
    ${buildWhereClause([
      season ? `"season" = ${season}` : null,
      leagueIds?.length && leagueIds.length > 0
        ? `"leagueId" IN (${leagueIds.map(Number).join(',')})`
        : null,
      playerIds?.length && playerIds.length > 0
        ? `"playerId" IN (${playerIds.map(Number).join(',')})`
        : null,
    ])}
  `)

  return data
}
