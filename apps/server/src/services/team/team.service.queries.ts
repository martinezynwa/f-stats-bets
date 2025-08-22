import { Team, TeamsValidationSchema } from '@f-stats-bets/types'
import { buildWhereClause, rawQueryArray } from '../../lib/rawQuery'

export const getTeams = async (input: TeamsValidationSchema) => {
  const { leagueIds, season } = input

  const teams = await rawQueryArray<Team>(
    `SELECT DISTINCT t.* FROM "Team" t
    INNER JOIN "TeamToLeague" ttl ON t."teamId" = ttl."teamId"
    ${buildWhereClause(
      [
        `ttl."season" = ${season}`,
        `${leagueIds?.length ? `ttl."leagueId" IN (${leagueIds.join(',')})` : null}`,
      ],
      'AND',
    )} `,
  )

  return teams
}
