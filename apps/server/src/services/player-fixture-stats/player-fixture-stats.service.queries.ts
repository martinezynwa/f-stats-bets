import { PlayerFixtureStats } from '@f-stats-bets/types'
import { buildWhereClause, rawQueryArray } from '../../lib'
import { GetPlayerFixtureStatsProps } from './player-fixture-stats.service.types'

export const getPlayerFixtureStats = async (input: GetPlayerFixtureStatsProps) => {
  const { season, leagueIds, dateFrom, dateTo } = input

  const data = await rawQueryArray<PlayerFixtureStats>(`
    SELECT * FROM "PlayerFixtureStats"
    ${buildWhereClause(
      [
        season ? `"season" = ${season}` : null,
        leagueIds?.length && leagueIds.length > 0
          ? `"leagueId" IN (${leagueIds.map(Number).join(',')})`
          : null,
        dateFrom && dateTo
          ? `"date"::date BETWEEN '${dateFrom}'::date AND '${dateTo}'::date`
          : null,
      ],
      'AND',
    )}
  `)

  return data
}
