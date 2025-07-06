import {
  BetResultType,
  InsertBet,
  InsertBetCompetition,
  MockBetCompetitionsSchema,
  MockBetsSchema,
  SeedCustomDataSchema,
} from '@f-stats-bets/types'
import { db } from 'src/db'
import { END_OF_DAY, START_OF_DAY } from '../../constants/constants'
import { createUserToBetCompetition } from '../bet-competition/bet-competition.service.mutations'
import { evaluateBets } from '../bet-evaluate/bet-evalute.service.mutations'

export const mockBets = async (input: MockBetsSchema) => {
  const { userIds: userIdsInput, dateFrom, dateTo, deletePreviousBets, betCompetitionId } = input

  const fixtures = await db
    .selectFrom('Fixture')
    .selectAll()
    .where('date', '>=', `${dateFrom}T${START_OF_DAY}`)
    .where('date', '<=', `${dateTo}T${END_OF_DAY}`)
    .execute()

  const fixtureIds = fixtures.map(fixture => fixture.fixtureId)

  const userIds =
    userIdsInput ?? (await db.selectFrom('User').select('id').execute()).map(user => user.id)

  if (deletePreviousBets) {
    await db
      .deleteFrom('Bet')
      .where('userId', 'in', userIds)
      .where('fixtureId', 'in', fixtureIds)
      .execute()
  }

  const betsToInsert: InsertBet[] = userIds.flatMap(userId =>
    fixtures.map(fixture => ({
      fixtureId: fixture.fixtureId,
      leagueId: fixture.leagueId,
      season: fixture.season,
      userId,
      betCompetitionId,
      fixtureResultBet:
        Object.values(BetResultType)[
          Math.floor(Math.random() * Object.values(BetResultType).length)
        ],
    })),
  )

  const addedBets = await db.insertInto('Bet').values(betsToInsert).returningAll().execute()

  return addedBets
}

export const mockBetCompetitions = async (input: MockBetCompetitionsSchema) => {
  const { userIds: userIdsInput, externalLeagueIds, season, name, deletePrevious } = input

  if (deletePrevious) {
    await db.deleteFrom('BetCompetitionToLeague').execute()
    await db.deleteFrom('BetCompetition').execute()
  }

  const userIds =
    userIdsInput ?? (await db.selectFrom('User').select('id').execute()).map(user => user.id)

  const leagues = await db
    .selectFrom('League')
    .select(['externalLeagueId', 'id'])
    .where('externalLeagueId', 'in', externalLeagueIds)
    .where('season', '=', season)
    .execute()

  const betCompetitionsToInsert: InsertBetCompetition[] = userIds.map(userId => ({
    userId,
    season,
    name,
    dateStart: `${season}-01-01`,
    dateEnd: `${season + 1}-12-31`,
    playerLimit: 99,
    isGlobal: true,
    fixtureResultPoints: 1,
  }))

  const addedBetCompetition = await db
    .insertInto('BetCompetition')
    .values(betCompetitionsToInsert)
    .returningAll()
    .executeTakeFirst()

  const betCompetitionToLeague = leagues.map(league => ({
    betCompetitionId: addedBetCompetition!.betCompetitionId,
    leagueId: league.id,
  }))

  const addedBetCompetitionToLeague = await db
    .insertInto('BetCompetitionToLeague')
    .values(betCompetitionToLeague)
    .returningAll()
    .execute()

  const addedUserToBetCompetitionRelations = await createUserToBetCompetition(
    addedBetCompetition!.betCompetitionId,
    userIds,
  )

  if (!addedBetCompetition) {
    throw new Error('Failed to create bet competition')
  }

  return {
    addedBetCompetition,
    addedBetCompetitionToLeague,
    addedUserToBetCompetitionRelations,
  }
}

export const mockCustomData = async (input: SeedCustomDataSchema) => {
  const {
    userIds,
    fixtureExternalLeagueIds,
    seasons,
    fixtureDateFrom,
    fixtureDateTo,
    deletePrevious,
    betCompetitionName,
  } = input

  for (const season of seasons) {
    const { addedBetCompetition } = await mockBetCompetitions({
      userIds,
      externalLeagueIds: fixtureExternalLeagueIds!,
      season,
      name: betCompetitionName || `Test Bet Competition ${season}`,
      deletePrevious,
    })

    await mockBets({
      userIds,
      dateFrom: fixtureDateFrom!,
      dateTo: fixtureDateTo!,
      deletePreviousBets: deletePrevious,
      betCompetitionId: addedBetCompetition.betCompetitionId,
    })
  }

  await evaluateBets({
    dateFrom: fixtureDateFrom!,
    dateTo: fixtureDateTo!,
  })
}
