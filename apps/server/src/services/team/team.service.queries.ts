import { Team, TeamsValidationSchema } from '@f-stats-bets/types'
import { rawQueryArray } from '../../lib/rawQuery'

export const getTeams = async (input: TeamsValidationSchema) => {
  const { leagueIds, season } = input

  const teams = await rawQueryArray<Team>(
    `SELECT DISTINCT t.* FROM "Team" t
    INNER JOIN "TeamToLeague" ttl ON t."teamId" = ttl."teamId"
    WHERE ttl."season" = ${season}
    ${leagueIds?.length ? `AND ttl."leagueId" IN (${leagueIds.join(',')})` : ''}`,
  )

  return teams
}

export const getTeamIds = async () => {
  const teams = await rawQueryArray<{ teamId: number }>(`SELECT "teamId" FROM "Team"`)

  return teams.map(t => t.teamId)
}
