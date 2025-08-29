import {
  FixtureStatus,
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
import { getFixtureIds, getManyFixturesDetail } from '../fixture/fixture.service.queries'
import { insertLeagueToDb, insertLeagueToSeasonToDb } from '../league/league.service.mutations'
import { fetchAndInsertPlayerFixtureStats } from '../player-fixture-stats/player-fixture-stats.service.mutations'
import { createAndInsertPlayerSeasonStats } from '../player-season-stats/player-season-stats.service.mutations'
import {
  createHistoricalPlayerSeasonStats,
  fetchAndInsertPlayers,
} from '../player/player.service.mutations'
import { insertTeamsToDb } from '../team/team.service.mutations'
import { getAssetPath, handleCsvSeed, parseCsv } from './seed.service.helpers'
import { TableWithRelations, TableWithoutRelations } from './seed.service.types'
import { log } from '../../lib/util'

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
  const {
    season,
    fixturesDateFrom,
    fixturesDateTo,
    historicalDataFirstSeason,
    historicalDataTotalSeasons,
    historicalDataPlayerIds,
    mockActions,
  } = input

  await db.deleteFrom('FixtureRound').where('season', '=', season).execute()
  await db.deleteFrom('Fixture').where('season', '=', season).execute()
  await db.deleteFrom('TeamToLeague').where('season', '=', season).execute()
  await db.deleteFrom('League').where('season', '=', season).execute()

  const leagues = getSupportedLeagues(season)

  log(
    `Fetching data for ${leagues.length} leagues [${leagues.map(l => l.name).join(', ')}] of season ${season}`,
  )

  for (const league of leagues) {
    const leagueId = league.id

    const leagueData = await fetchLeagueInfo(leagueId, season)
    log(`Fetched league ${leagueId} | ${leagueData.league.name}`)

    const insertedLeague = await insertLeagueToDb({ leagueData, season })
    log(`Inserted league ${leagueId} | ${insertedLeague?.name}`)

    const insertedLeagueToSeason = await insertLeagueToSeasonToDb(leagueId, season)
    log(
      `Inserted LeagueToSeason ${insertedLeagueToSeason?.leagueId}-${insertedLeagueToSeason?.season}`,
    )

    const teamsData = await fetchTeamsInfo(leagueId, season)
    log(`Fetched teams for leagueId ${leagueId} | got ${teamsData.length} teams`)

    const insertedTeams = await insertTeamsToDb({
      leagueId,
      season,
      teamsData,
    })

    log(`Inserted teams for leagueId ${leagueId} | added ${insertedTeams.addedTeams.length} teams`)
    log(
      `Inserted TeamToLeague for leagueId ${leagueId} | added ${insertedTeams.addedTeamsToLeague.length} records`,
    )

    const insertedPlayers = await fetchAndInsertPlayers({
      season,
      leagueIds: [leagueId],
      shouldMockResponse: mockActions?.includes('fetchAndInsertPlayers'),
    })
    log(`Inserted ${insertedPlayers.addedPlayers.length} players from leagueId ${leagueId}`)
    log(
      `Inserted ${insertedPlayers.addedPlayersToTeams.length} PlayerToTeam records based on players from leagueId ${leagueId}`,
    )

    const externalFixturesData = await fetchFixtures({
      leagueIds: [leagueId],
      season,
      dateFrom: fixturesDateFrom,
      dateTo: fixturesDateTo,
    })
    log(`Fetched fixtures for ${leagueId} | ${externalFixturesData.length} fixtures`)

    const insertedFixtures = await upsertFixtures(externalFixturesData, season)
    log(
      `Inserted ${insertedFixtures?.newFixtures.length} new fixtures | ${insertedFixtures?.updatedFixtures.length} updated fixtures`,
    )

    const fixtureDetails = await getManyFixturesDetail({
      leagueIds: [leagueId],
      dateFrom: fixturesDateFrom,
      dateTo: fixturesDateTo,
      status: [FixtureStatus.FINISHED],
    })
    log(`Got ${fixtureDetails.length} fixture details for ${leagueId}`)

    const insertedPlayerFixtureStats = await fetchAndInsertPlayerFixtureStats(fixtureDetails)
    log(
      `Inserted player fixture stats for ${leagueId} | ${insertedPlayerFixtureStats.length} records`,
    )

    const fixtureIds = await getFixtureIds({
      dateFrom: fixturesDateFrom,
      dateTo: fixturesDateTo,
      leagueIds: [leagueId],
    })
    log(`Fetched fixture ids for ${leagueId} | ${fixtureIds.length} fixture ids`)

    const insertedPlayerSeasonStats = await createAndInsertPlayerSeasonStats({ fixtureIds })
    log(
      `Added ${insertedPlayerSeasonStats.addedPlayerSeasonStats.length} player season stats | ${insertedPlayerSeasonStats.updatedPlayerSeasonStats.length} updated player season stats`,
    )
  }

  const shouldFetchHistoricalPlayerSeasonStats =
    historicalDataFirstSeason && historicalDataTotalSeasons

  if (shouldFetchHistoricalPlayerSeasonStats) {
    await createHistoricalPlayerSeasonStats({
      firstSeason: historicalDataFirstSeason,
      totalSeasons: historicalDataTotalSeasons,
      playerIds: historicalDataPlayerIds,
    })
  }
}
