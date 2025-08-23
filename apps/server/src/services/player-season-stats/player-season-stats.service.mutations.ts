import { InsertPlayerSeasonStats, PlayerFixtureStats, PlayerSeasonStats } from '@f-stats-bets/types'
import { db } from '../../db'
import { getGamesPlayedInLeagues, getLeagues } from '../league/league.service.queries'
import {
  countAndEditPlayerSeasonStats,
  countPlayerSeasonStats,
  getStatValue,
  isEligibleForRanking,
} from './player-season-stats.service.helpers'
import { rawQueryArray } from '../../lib'
import {
  ExternalPlayerInfoWithStatsResponse,
  ExternalPlayerStatistics,
} from '../../types/external/external-player.types'
import { limitDecimalPlaces, getNumberValue, getStringValue } from '../../lib/util'

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

export const createAndInsertPlayerSeasonStatsFromExternalApi = async (
  data: ExternalPlayerInfoWithStatsResponse[],
) => {
  const categorizedStatsByLeague = data.reduce(
    (acc, curr) => {
      const playerId = curr.player.id

      if (!acc[playerId]) {
        acc[playerId] = []
      }

      acc[playerId].push(...curr.statistics)

      return acc
    },
    {} as Record<number, ExternalPlayerStatistics[]>,
  )

  const leagues = await getLeagues()
  const leaguesWithGamesPlayed = new Map(
    leagues.map(l => [`${l.leagueId}-${l.season}`, l.gamesPlayed]),
  )

  const playerSeasonStatsToInsert = Object.entries(categorizedStatsByLeague).flatMap(
    ([playerId, statistics]) =>
      statistics.map(stat => {
        const object: InsertPlayerSeasonStats = {
          playerId: parseInt(playerId),
          season: getNumberValue(stat.league.season),
          leagueId: getNumberValue(stat.league.id),
          teamId: getNumberValue(stat.team.id),
          appearences: getNumberValue(stat.games.appearences),
          lineups: stat.games.lineups,
          captain: undefined, //TODO
          substitute: stat.substitutes.bench,
          minutes: getNumberValue(stat.games.minutes),
          position: getStringValue(stat.games.position),
          rating: stat.games.rating ? limitDecimalPlaces(parseFloat(stat.games.rating)) : undefined,
          goals: getNumberValue(stat.goals.total),
          assists: getNumberValue(stat.goals.assists),
          conceded: getNumberValue(stat.goals.conceded),
          saves: getNumberValue(stat.goals.saves),
          shotsTotal: getNumberValue(stat.shots.total),
          shotsOn: getNumberValue(stat.shots.on),
          passesTotal: getNumberValue(stat.passes.total),
          passesKey: getNumberValue(stat.passes.key),
          passesAccuracy: stat.passes.accuracy,
          goalsPerGame: getStatValue(stat.goals.total, stat.games.appearences, 'perGame'),
          goalsFrequency: getStatValue(stat.goals.total, stat.games.minutes, 'frequency'),
          goalsAssists: getNumberValue(stat.goals.total) + getNumberValue(stat.goals.assists),
          assistsPerGame: getStatValue(stat.goals.assists, stat.games.appearences, 'perGame'),
          assistsFrequency: getStatValue(stat.goals.assists, stat.games.minutes, 'frequency'),
          concededPerGame: getStatValue(stat.goals.conceded, stat.games.appearences, 'perGame'),
          eligibileAppearencesForRating: getNumberValue(stat.games.appearences),
          eligibleForRanking: stat.games.appearences
            ? isEligibleForRanking(
                leaguesWithGamesPlayed.get(`${stat.league.id}-${stat.league.season}`)!,
                stat.games.appearences,
              )
            : false,
          minutesPerGame: getStatValue(stat.games.minutes, stat.games.appearences, 'perGame'),
          substitutesIn: stat.substitutes.in,
          substitutesBench: stat.substitutes.bench,
          passesKeyPerGame: stat.passes.key
            ? getStatValue(stat.passes.key, stat.games.appearences, 'perGame')
            : undefined,
          passesTotalPerGame: getStatValue(stat.passes.total, stat.games.appearences, 'perGame'),
          savesPerGame: getStatValue(stat.goals.saves, stat.games.appearences, 'perGame'),
          shotsOnPerGame: getStatValue(stat.shots.on, stat.games.appearences, 'perGame'),
          shotsTotalPerGame: getStatValue(stat.shots.total, stat.games.appearences, 'perGame'),
        }

        return object
      }),
  )

  const added = await insertPlayerSeasonStats(playerSeasonStatsToInsert)

  return added
}
