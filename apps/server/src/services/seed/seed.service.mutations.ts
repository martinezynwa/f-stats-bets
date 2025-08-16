import { SeedFromExternalApiValidationSchema, Team, User, UserSettings } from '@f-stats-bets/types'
import fs from 'fs'
import { sql } from 'kysely'
import path from 'path'
import { getSupportedLeagues } from '../../assets/league-data'
import { db } from '../../db'
import { fetchFixtures } from '../external/external.fixture.service'
import { fetchLeagueInfo } from '../external/external.league.service'
import { fetchTeamsInfo } from '../external/external.team.service'
import { upsertFixtures } from '../fixture/fixture.service.mutations'
import { insertLeagueToDb, insertLeagueToSeasonToDb } from '../league/league.service.mutations'
import { insertTeamsToDb } from '../team/team.service.mutations'
import { getAssetPath, handleCsvSeed, parseCsv } from './seed.service.helpers'
import { TableWithRelations, TableWithoutRelations } from './seed.service.types'
import { fetchAndInsertPlayers } from '../player/player.service.mutations'

export const initDatabase = async (dbSchemaPath?: string) => {
  try {
    const schemaPath = path.join(__dirname, dbSchemaPath ?? '../../migrations/database.schema.sql')
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
      const parsedTeamData = parseCsv(teamDataFile) as Team[]

      await db.insertInto('Team').values(parsedTeamData).execute()
    },
  }

  for (const tableName of tableNames) {
    return await mapper[tableName]()
  }
}

export const seedDatabaseFromExternalApi = async (input: SeedFromExternalApiValidationSchema) => {
  const { season, dateFrom, dateTo } = input

  await db.deleteFrom('FixtureRound').where('season', '=', season).execute()
  await db.deleteFrom('Fixture').where('season', '=', season).execute()
  await db.deleteFrom('TeamToLeague').where('season', '=', season).execute()
  await db.deleteFrom('League').where('season', '=', season).execute()

  const leagues = getSupportedLeagues(season)

  // eslint-disable-next-line no-console
  console.log(
    `Fetching data for ${leagues.length} leagues [${leagues.map(l => l.name).join(', ')}] of season ${season}`,
  )

  for (const league of leagues) {
    const leagueId = league.id

    const leagueData = await fetchLeagueInfo(leagueId, season)
    await insertLeagueToDb({ leagueData, season })
    await insertLeagueToSeasonToDb(leagueId, season)

    const teamsData = await fetchTeamsInfo(leagueId, season)
    await insertTeamsToDb({
      leagueId,
      season,
      teamsData,
    })

    await fetchAndInsertPlayers({ season, leagueIds: [leagueId] })

    const externalFixturesData = await fetchFixtures({
      leagueIds: [leagueId],
      season,
      dateFrom,
      dateTo,
    })
    await upsertFixtures(externalFixturesData, season)
  }
}
