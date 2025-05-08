import { InsertTeam } from '@f-stats-bets/types'
import { db } from '../../db'
import { InsertTeamToDbProps } from './team.service.types'

export const insertTeamsToDb = async ({
  externalLeagueId,
  leagueId,
  season,
  teamsData,
  nationIds,
  national,
}: InsertTeamToDbProps) => {
  const externalTeamIdsFromAPIResponse = teamsData.map(team => team.team.id)
  const existingTeams = await db
    .selectFrom('Team')
    .select('externalTeamId')
    .where('leagueId', '=', leagueId)
    .where('season', '=', season)
    .where('externalTeamId', 'in', externalTeamIdsFromAPIResponse)
    .execute()

  const existingTeamExternalIds = existingTeams.map(
    (team: { externalTeamId: number }) => team.externalTeamId,
  )

  const data: InsertTeam[] = teamsData
    .filter(team => !existingTeamExternalIds.includes(team.team.id))
    .filter(team => (!national ? true : nationIds?.includes(team.team.id)))
    .map(({ team, venue }) => ({
      externalTeamId: team.id,
      externalLeagueId,
      season: season,
      name: team.name,
      leagueId: leagueId,
      code: team.code ? team.code : team.name.replace(/\s+/g, '').substring(0, 3).toUpperCase(),
      country: team.country,
      logo: team.logo,
      national: national ?? team.national,
      venue: venue.name || '',
    }))

  if (data.length === 0) {
    return []
  }

  const added = await db.insertInto('Team').values(data).returningAll().execute()

  return added
}
