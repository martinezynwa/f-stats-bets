import { BetResultType, InsertBet, MockBetsSchema } from '@f-stats-bets/types'
import { db } from 'src/db'
import { END_OF_DAY, START_OF_DAY } from '../../constants/constants'

export const mockBets = async (input: MockBetsSchema) => {
  const { userId, dateFrom, dateTo, deletePreviousBets } = input

  const fixtures = await db
    .selectFrom('Fixture')
    .selectAll()
    .where('date', '>=', `${dateFrom}T${START_OF_DAY}`)
    .where('date', '<=', `${dateTo}T${END_OF_DAY}`)
    .execute()

  const fixtureIds = fixtures.map(fixture => fixture.fixtureId)

  if (deletePreviousBets) {
    await db
      .deleteFrom('Bet')
      .where('userId', '=', userId)
      .where('fixtureId', 'in', fixtureIds)
      .execute()
  }

  const betsToInsert: InsertBet[] = fixtures.map(fixture => ({
    fixtureId: fixture.fixtureId,
    leagueId: fixture.leagueId,
    season: fixture.season,
    userId,
    betCompetitionId: '1',
    fixtureResultBet:
      Object.values(BetResultType)[Math.floor(Math.random() * Object.values(BetResultType).length)],
  }))

  const addedBets = await db.insertInto('Bet').values(betsToInsert).returningAll().execute()

  return addedBets
}
