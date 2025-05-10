import { Fixture, FixtureRound, InsertFixture } from '@f-stats-bets/types'
import { completedFixtureStatuses } from '../../constants/constants'
import { db } from '../../db'
import { ExternalFixtureResponse } from '../../types/external/external-fixture.types'
import { prepareFixturesForInsertion } from './fixture.service.helpers'
import { FixtureDetailWithRound } from './fixture.service.types'

export const insertFixtures = async (fixtures: InsertFixture[]) => {
  const added = await db.insertInto('Fixture').values(fixtures).returningAll().execute()

  return added
}

/**
 * Based on external service response, determine which fixtures are new or updated
 * and insert or update them in the database
 */
export const fixturesUpsert = async (
  externalFixturesData: ExternalFixtureResponse[],
  season: number,
) => {
  const externalFixtureIds = externalFixturesData.map(fixture => fixture.fixture.id)

  const existingFixturesInDb = await db
    .selectFrom('Fixture')
    .where('season', '=', season)
    .where('fixtureId', 'in', externalFixtureIds)
    .where('status', 'not in', completedFixtureStatuses) //to ignore already played fixtures
    .selectAll()
    .execute()

  const existingFixturesMap = new Map(
    existingFixturesInDb?.map(fixture => [fixture.fixtureId, fixture]),
  )

  const updatedFixtureData = externalFixturesData.reduce(
    (acc, curr) => {
      const existingFixtureData = existingFixturesMap?.get(curr.fixture.id)

      if (!existingFixtureData) {
        acc.newFixtures.push({ ...curr })

        return acc
      }

      if (
        existingFixtureData?.date !== curr.fixture.date ||
        existingFixtureData?.referee !== curr.fixture.referee ||
        existingFixtureData?.venue !== curr.fixture.venue.name
      ) {
        acc.updatedFixtures.push({
          ...existingFixtureData,
          date: curr.fixture.date,
          referee: curr.fixture.referee,
          venue: curr.fixture.venue.name,
        })
      }

      return acc
    },
    {
      updatedFixtures: [] as Fixture[],
      newFixtures: [] as ExternalFixtureResponse[],
    },
  )

  if (
    updatedFixtureData.newFixtures.length === 0 &&
    updatedFixtureData.updatedFixtures.length === 0
  ) {
    return
  }

  const response: {
    updatedFixtures: Fixture[]
    newFixtures: Fixture[]
  } = {
    updatedFixtures: [],
    newFixtures: [],
  }

  if (updatedFixtureData.newFixtures.length > 0) {
    const fixturesToInsert = await prepareFixturesForInsertion(
      updatedFixtureData.newFixtures,
      season,
    )

    const insertedFixtures = await insertFixtures(fixturesToInsert)

    const fixtureIds = insertedFixtures.map(fixture => fixture.fixtureId)

    await fixtureRoundsCreate(fixtureIds)

    response.newFixtures.push(...insertedFixtures)
  }

  if (updatedFixtureData.updatedFixtures.length > 0) {
    await updateExistingFixturesWithNewDate(updatedFixtureData.updatedFixtures)

    response.updatedFixtures.push(...updatedFixtureData.updatedFixtures)
  }

  return response
}

export const fixtureRoundsCreate = async (fixtureIds: number[]) => {
  const fixtures = await db
    .selectFrom('Fixture')
    .select(['fixtureId', 'externalLeagueId', 'leagueId', 'season', 'round', 'date'])
    .where('fixtureId', 'in', fixtureIds)
    .where('round', '>=', 1)
    .execute()

  const rounds = fixtures.reduce(
    (acc, curr) => {
      const key = `${curr.externalLeagueId}-${curr.round}`

      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(curr)
      return acc
    },
    {} as Record<string, FixtureDetailWithRound[]>,
  )

  const roundsStarts = Object.entries(rounds).map(([_, items]) => {
    const sorted = items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const { externalLeagueId, leagueId, season, round, date } = sorted[0]!

    return {
      externalLeagueId,
      leagueId,
      season,
      round,
      hasStarted: false,
      dateStarted: date,
    }
  })

  await db.insertInto('FixtureRound').values(roundsStarts).returningAll().execute()
}

export const updateFixturesWithFixtureRound = async (
  fixtureRoundData: FixtureRound[],
  fixtures: FixtureDetailWithRound[],
) => {}

export const updateExistingFixturesWithNewDate = async (fixtures: Fixture[]) => {}
