import { InsertTeam, Team, TeamToLeague } from '@f-stats-bets/types'
import { db } from '../../db'
import { GetTeamKeyProps, InsertTeamToDbProps, PrepareTeamsDataProps } from './team.service.types'
import { ExternalTeamResponse } from 'src/types/external/external-team.types'
import { fetchTeamInfo } from '../external/external.team.service'
import { getTeamIds } from './team.service.queries'

const getTeamKey = (input: GetTeamKeyProps) => `${input.teamId}-${input.season}-${input.leagueId}`

export const transformTeamDataForInsert = (input: ExternalTeamResponse) => {
  const { team, venue } = input

  return {
    teamId: team.id,
    code: team.code ? team.code : team.name.replace(/\s+/g, '').substring(0, 3).toUpperCase(),
    country: team.country,
    logo: team.logo,
    name: team.name,
    national: team.national,
    venue: venue.name || '',
  }
}

const prepareTeamsDataForInsert = async (input: PrepareTeamsDataProps) => {
  const { teamsData, season, leagueId } = input

  const teamIdsFromExternalResponse = teamsData.map(team => team.team.id)
  const existingTeams = await db
    .selectFrom('Team')
    .select('teamId')
    .where('teamId', 'in', teamIdsFromExternalResponse)
    .execute()

  const existingTeamIds = existingTeams.map(team => team.teamId)

  const teamDataToInsert: InsertTeam[] = teamsData
    .filter(team => !existingTeamIds.includes(team.team.id))
    .map(item => transformTeamDataForInsert(item))

  const existingTeamsToLeagueRecords = await db
    .selectFrom('TeamToLeague')
    .selectAll()
    .where('teamId', 'in', teamIdsFromExternalResponse)
    .where('season', '=', season)
    .where('leagueId', '=', leagueId)
    .execute()

  const existingTeamsToLeagueKeys = existingTeamsToLeagueRecords.map(team =>
    getTeamKey({
      teamId: team.teamId,
      season,
      leagueId,
    }),
  )

  const teamsToLeagueToInsert = teamsData
    .filter(team => {
      const teamKey = getTeamKey({
        teamId: team.team.id,
        season,
        leagueId,
      })
      return !existingTeamsToLeagueKeys.includes(teamKey)
    })
    .map(team => ({
      teamId: team.team.id,
      season,
      leagueId,
    }))

  return { teamDataToInsert, teamsToLeagueToInsert }
}

export const insertTeamsToDb = async ({ leagueId, season, teamsData }: InsertTeamToDbProps) => {
  const { teamDataToInsert, teamsToLeagueToInsert } = await prepareTeamsDataForInsert({
    teamsData,
    season,
    leagueId,
  })
  let addedTeams: Team[] = []
  let addedTeamsToLeague: TeamToLeague[] = []

  if (teamDataToInsert.length > 0) {
    addedTeams = await db.insertInto('Team').values(teamDataToInsert).returningAll().execute()
  }

  if (teamsToLeagueToInsert.length > 0) {
    addedTeamsToLeague = await db
      .insertInto('TeamToLeague')
      .values(teamsToLeagueToInsert)
      .returningAll()
      .execute()
  }

  return { addedTeams, addedTeamsToLeague }
}

export const createNewTeamsBasedOnTransfers = async (teamIds: number[]) => {
  const existingTeamIds = await getTeamIds()
  const newTeamIds = teamIds.filter(id => !existingTeamIds.includes(id))

  if (newTeamIds.length === 0) return []

  const newTeams: ExternalTeamResponse[] = []

  for (const teamId of newTeamIds) {
    const team = await fetchTeamInfo(teamId)
    newTeams.push(...team)
  }

  const dataToInsert = newTeams.map(item => transformTeamDataForInsert(item))

  const addedTeams = await db.insertInto('Team').values(dataToInsert).returningAll().execute()

  return addedTeams
}
