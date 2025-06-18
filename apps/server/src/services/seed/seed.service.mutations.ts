import {
  InsertTeam,
  LeagueType,
  SeedFromExternalApiValidationSchema,
  Team,
  User,
  UserSettings,
} from '@f-stats-bets/types'
import fs from 'fs'
import { sql } from 'kysely'
import path from 'path'
import { getSupportedLeagues } from '../../assets/league-data'
import { db } from '../../db'
import { fetchFixtures } from '../external/external.fixture.service'
import { fetchLeagueInfo } from '../external/external.league.service'
import { fetchTeamsInfo } from '../external/external.team.service'
import { upsertFixtures } from '../fixture/fixture.service.mutations'
import { insertLeagueToDb } from '../league/league.service.mutations'
import { insertTeamsToDb } from '../team/team.service.mutations'
import { getAssetPath, handleCsvSeed, parseCsv } from './seed.service.helpers'
import { TableWithRelations, TableWithoutRelations } from './seed.service.types'

export const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../../migrations/database.schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await sql.raw(schema).execute(db)
    return { success: true }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

export const initUsersWithSettings = async () => {
  const userData = getAssetPath('User.csv')
  const userSettingsData = getAssetPath('UserSettings.csv')

  if (!userData) {
    throw new Error('User data not found')
  }

  const parsedUserData = parseCsv(userData) as User[]
  const userWithUserIds = parsedUserData.map(user => ({
    ...user,
    id: user.providerId,
  }))
  const createdUsers = await db.insertInto('User').values(userWithUserIds).returningAll().execute()

  if (userSettingsData) {
    const parsedUserSettingsData = parseCsv(userSettingsData) as UserSettings[]

    const userSettings = createdUsers.map(user => {
      const data = parsedUserSettingsData.find(setting => setting.providerId === user.providerId)

      return {
        userId: user.id,
        providerId: user.providerId,
        ...data,
      }
    })

    await db.insertInto('UserSettings').values(userSettings).execute()

    return { parsedUserData, parsedUserSettingsData }
  }

  return { parsedUserData }
}

export const seedDatabaseFromCsv = async (tableNames: TableWithoutRelations[]) => {
  try {
    for (const tableName of tableNames) {
      await handleCsvSeed(tableName, getAssetPath(`${tableName}.csv`))
    }

    return { success: true, message: 'Successfully seeded Season data' }
  } catch (error) {
    console.error('Error seeding Season data:', error)
    throw error
  }
}

export const seedRelationDataFromCsv = async (tableNames: TableWithRelations[]) => {
  const mapper: Record<TableWithRelations, () => Promise<void>> = {
    Team: async () => {
      const teamDataFile = getAssetPath('Team.csv')
      const parsedTeamData = parseCsv(teamDataFile) as Omit<Team, 'leagueId'>[]

      const leagues = await db
        .selectFrom('League')
        .selectAll()
        .where('type', 'not in', [LeagueType.UNASSIGNED, LeagueType.TOTALS])
        .execute()

      const insertTeamData: InsertTeam[] = leagues.flatMap(league => {
        const teamsOfLeague = parsedTeamData.filter(
          team =>
            Number(team.externalLeagueId) === league.externalLeagueId &&
            Number(team.season) === league.season,
        )

        return teamsOfLeague.map(team => ({
          ...team,
          externalLeagueId: Number(team.externalLeagueId),
          externalTeamId: Number(team.externalTeamId),
          season: Number(team.season),
          leagueId: league.id,
        }))
      })

      await db.insertInto('Team').values(insertTeamData).execute()
    },
  }

  for (const tableName of tableNames) {
    return await mapper[tableName]()
  }
}

export const seedDatabaseFromExternalApi = async (input: SeedFromExternalApiValidationSchema) => {
  const { seasons, dateFrom, dateTo } = input

  await db.deleteFrom('FixtureRound').where('season', 'in', seasons).execute()
  await db.deleteFrom('Fixture').where('season', 'in', seasons).execute()
  await db.deleteFrom('Team').where('season', 'in', seasons).execute()
  await db.deleteFrom('League').where('season', 'in', seasons).execute()
  await db.deleteFrom('Season').where('seasonId', 'in', seasons).execute()

  for (const season of seasons) {
    const leagues = getSupportedLeagues(season)

    for (const league of leagues) {
      const leagueData = await fetchLeagueInfo(league.id, season)
      const createdLeague = await insertLeagueToDb({ leagueData, season })

      const teamsData = await fetchTeamsInfo(league.id, season)
      await insertTeamsToDb({
        leagueId: createdLeague!.id,
        externalLeagueId: league.id,
        season,
        teamsData,
      })

      const externalFixturesData = await fetchFixtures({
        externalLeagueIds: [league.id],
        season,
        dateFrom,
        dateTo,
      })
      await upsertFixtures(externalFixturesData, season)
    }
  }
}
