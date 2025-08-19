import { InsertPlayerSeasonStats, PlayerFixtureStats, PlayerSeasonStats } from '@f-stats-bets/types'
import { db } from '../../db'
import { getGamesPlayedInLeagues } from '../league/league.service.queries'
import {
  countAndEditPlayerSeasonStats,
  countPlayerSeasonStats,
} from './player-season-stats.service.helpers'
import { rawQueryArray } from 'src/lib'

export const insertPlayerSeasonStats = async (playerSeasonStats: InsertPlayerSeasonStats[]) => {
  const added = await db
    .insertInto('PlayerSeasonStats')
    .values(playerSeasonStats)
    .returningAll()
    .execute()

  return added
}

export const createAndInsertPlayerSeasonStats = async (fixtureIds: number[]) => {
  const playerFixtureStats = await rawQueryArray<PlayerFixtureStats>(`
    SELECT * FROM "PlayerFixtureStats"
    WHERE "fixtureId" IN (${fixtureIds.join(',')})
  `)

  const leagueIds = [...new Set(playerFixtureStats.map(p => p.leagueId))]

  const playerLeaguePairs = [
    ...new Set(playerFixtureStats.map(p => `(${p.playerId}, ${p.leagueId})`)),
  ].join(',')

  const existingPlayerSeasonStats = await rawQueryArray<PlayerSeasonStats>(`
    SELECT * FROM "PlayerSeasonStats"
    WHERE ("playerId", "leagueId") IN (${playerLeaguePairs})
  `)

  const existingStatsSet = new Set(
    existingPlayerSeasonStats.map(stats => `${stats.playerId}-${stats.leagueId}`),
  )

  //categorize players into two groups:
  //1 - players that have existing PlayerSeasonStats for the specific league,
  //2 - players that do not have PlayerSeasonStats for the specific league,
  const playerFixtureStatsCategorized = playerFixtureStats.reduce(
    (acc, curr) => {
      const playerLeagueKey = `${curr.playerId}-${curr.leagueId}`

      if (existingStatsSet.has(playerLeagueKey)) {
        acc.withSeasonStats.push(curr)
      } else {
        acc.withoutSeasonStats.push(curr)
      }
      return acc
    },
    {
      withSeasonStats: [] as PlayerFixtureStats[],
      withoutSeasonStats: [] as PlayerFixtureStats[],
    },
  )

  const { withSeasonStats, withoutSeasonStats } = playerFixtureStatsCategorized

  const gamesPlayedInLeagues = await getGamesPlayedInLeagues(leagueIds)

  let addedPlayerSeasonStats: PlayerSeasonStats[] = []
  let updatedPlayerSeasonStats: PlayerSeasonStats[] = []

  if (withoutSeasonStats.length > 0) {
    const groupedByPlayer = withoutSeasonStats.reduce(
      (acc, curr) => {
        const key = curr.playerId

        if (!acc[key]) {
          acc[key] = []
        }

        acc[key].push(curr)

        return acc
      },
      {} as Record<string, PlayerFixtureStats[]>,
    )

    const playerSeasonStats = Object.keys(groupedByPlayer).flatMap(key =>
      countPlayerSeasonStats(groupedByPlayer[key]!, gamesPlayedInLeagues),
    )

    addedPlayerSeasonStats = await insertPlayerSeasonStats(playerSeasonStats)

    //TODO create PlayerToTeam[] if necessary
  }

  if (withSeasonStats.length > 0) {
    //combine data for next step
    const combinedData = existingPlayerSeasonStats.map(playerSeasonStats => ({
      playerSeasonStats,
      playerFixtureStats: withSeasonStats.find(p => p.playerId === playerSeasonStats.playerId),
    }))

    //go through each record and edit existing PlayerSeasonStats
    updatedPlayerSeasonStats = combinedData.map(({ playerFixtureStats, playerSeasonStats }) =>
      countAndEditPlayerSeasonStats(
        playerSeasonStats,
        playerFixtureStats!,
        gamesPlayedInLeagues[0]!.gamesPlayed,
      ),
    )

    //update existing PlayerSeasonStats in db
    await db.transaction().execute(async trx => {
      for (const stats of updatedPlayerSeasonStats) {
        const { id, createdAt, updatedAt, ...updateData } = stats

        await trx
          .updateTable('PlayerSeasonStats')
          .set({ ...updateData, updatedAt: new Date() })
          .where('id', '=', id)
          .execute()
      }
    })
  }

  return { addedPlayerSeasonStats, updatedPlayerSeasonStats }
}
