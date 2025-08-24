import { Fixture, FixtureRound, InsertFixture, completedFixtureStatuses } from '@f-stats-bets/types'
import { db } from '../../db'
import { ExternalFixtureResponse } from '../../types/external/external-fixture.types'
import { prepareFixturesForInsertion, getFixtureWinnerWithGoals } from './fixture.service.helpers'
import { FixtureDetailWithRound } from './fixture.service.types'

export const createFixtures = async (fixtures: InsertFixture[]) => {
  const added = await db.insertInto('Fixture').values(fixtures).returningAll().execute()

  return added
}

/**
 * Based on external service response, determine which fixtures are new or updated
 * and insert or update them in the database
 */
export const upsertFixtures = async (
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

    const newFixtures = await createFixtures(fixturesToInsert)

    /*const fixtureIds = newFixtures.map(fixture => fixture.fixtureId)
      const newFixtureRounds = await createFixtureRounds(fixtureIds)

    await updateFixturesWithFixtureRound(newFixtureRounds, newFixtures) */

    response.newFixtures.push(...newFixtures)
  }

  if (updatedFixtureData.updatedFixtures.length > 0) {
    await updateExistingFixturesWithNewDate(updatedFixtureData.updatedFixtures)

    response.updatedFixtures.push(...updatedFixtureData.updatedFixtures)
  }

  return response
}

/**
 * Create FixtureRound[]
 *
 * use-case once Fixture[] is created
 */
export const createFixtureRounds = async (fixtureIds: number[]) => {
  const fixtures = await db
    .selectFrom('Fixture')
    .select(['fixtureId', 'leagueId', 'season', 'round', 'date'])
    .where('fixtureId', 'in', fixtureIds)
    .where('round', '>=', 1)
    .execute()

  const rounds = fixtures.reduce(
    (acc, curr) => {
      const key = `${curr.leagueId}-${curr.round}`

      if (!acc[key]) {
        acc[key] = []
      }

      acc[key].push(curr)
      return acc
    },
    {} as Record<string, FixtureDetailWithRound[]>,
  )

  const fixtureRounds = Object.entries(rounds).map(([_, items]) => {
    const sorted = items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const { leagueId, season, round, date } = sorted[0]!

    return {
      leagueId,
      season,
      round,
      hasStarted: false,
      dateStarted: date,
    }
  })

  const added = await db.insertInto('FixtureRound').values(fixtureRounds).returningAll().execute()

  return added
}

/**
 * Update existing Fixture[] with FixtureRound[] reference
 *
 * use-case once Fixture is created
 */
export const updateFixturesWithFixtureRound = async (
  fixtureRoundData: FixtureRound[],
  fixtures: FixtureDetailWithRound[],
) => {
  const fixturesWithFixtureRound = fixtureRoundData.flatMap(item =>
    fixtures
      .filter(f => `${f.leagueId}${f.round}` === `${item.leagueId}${item.round}`)
      .map(f => ({
        fixtureId: f.fixtureId,
        fixtureRoundId: item.id,
      })),
  )

  const updatedFixtures = await db.transaction().execute(async trx => {
    const updates = fixturesWithFixtureRound.map(fixture =>
      trx
        .updateTable('Fixture')
        .set({ fixtureRoundId: fixture.fixtureRoundId })
        .where('fixtureId', '=', fixture.fixtureId)
        .returningAll()
        .execute(),
    )
    return await Promise.all(updates)
  })

  return updatedFixtures
}

/**
 * Used for jobs
 *
 * Update of many existing fixtures with new data
 *
 * date, referee, venue
 */
export const updateExistingFixturesWithNewDate = async (fixtures: Fixture[]) => {
  const updated = await db.transaction().execute(async trx => {
    const updates = fixtures.map(fixture =>
      trx
        .updateTable('Fixture')
        .set(fixture)
        .where('fixtureId', '=', fixture.fixtureId)
        .returningAll()
        .execute(),
    )
    return await Promise.all(updates)
  })

  return updated
}

/**
 * Update existing FixtureRound[] hasStarted boolean
 *
 * use-case once 1st game in round finished
 */
export const updateManyFixtureRoundStatus = async (fixtures: Fixture[]) => {
  //TODO
}

export const updateFixtureStatus = async (fixtures: ExternalFixtureResponse[]) => {
  const updated = await db.transaction().execute(async trx => {
    const updates = fixtures.map(fixture =>
      trx
        .updateTable('Fixture')
        .set({ status: fixture.fixture.status.short })
        .where('fixtureId', '=', fixture.fixture.id)
        .returningAll()
        .execute(),
    )
    return await Promise.all(updates)
  })

  return updated
}

/**
 * Update many fixtures in db with finished info
 *
 * usecase - updating already existing fixtures with finished state
 *
 * @fixtures finished fixtures
 * @teamInfo both API and DB ids of teams from finished fixtures
 */
export const updateFinishedFixtureData = async (fixtures: ExternalFixtureResponse[]) => {
  const updated = await db.transaction().execute(async trx => {
    const updates = fixtures.map(fixture => {
      const { awayTeamGoalsFinish, homeTeamGoalsFinish, teamIdWon } =
        getFixtureWinnerWithGoals(fixture) || {}

      return trx
        .updateTable('Fixture')
        .set({
          status: fixture?.fixture.status?.short,
          referee: fixture?.fixture.referee,
          venue: fixture?.fixture.venue.name,
          elapsed: fixture?.fixture.status?.elapsed,
          teamIdWon,
          homeTeamGoalsFinish,
          homeTeamGoalsHalf: fixture.score?.halftime?.home,
          homeTeamGoalsExtra: fixture.score?.extratime?.home,
          homeTeamGoalsPenalty: fixture.score?.penalty?.home,
          awayTeamGoalsFinish,
          awayTeamGoalsHalf: fixture.score?.halftime?.away,
          awayTeamGoalsExtra: fixture.score?.extratime?.away,
          awayTeamGoalsPenalty: fixture.score?.penalty?.away,
        })
        .where('fixtureId', '=', fixture?.fixture.id)
        .returningAll()
        .execute()
    })
    return await Promise.all(updates)
  })

  return updated.flat()
}
