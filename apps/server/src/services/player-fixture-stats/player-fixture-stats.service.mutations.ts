import { InsertPlayerFixtureStats } from '@f-stats-bets/types'
import { db } from '../../db'
import { FixtureDetail } from '../../types/external/external-player-fixture-stats.types'
import { fetchPlayerFixtureStats } from '../external/external.player.service'

export const fetchAndInsertPlayerFixtureStats = async (fixturesWithDetails: FixtureDetail[]) => {
  const playerFixtureStatsData = await fetchPlayerFixtureStats(fixturesWithDetails)

  const playerFixtureStatsToInsert = playerFixtureStatsData.flatMap(
    ({ fixtureDetail, response }) => {
      const { date, season, fixtureId, leagueId } = fixtureDetail
      const teamInfo = response[0].team
      const allPlayerStats = response[0].players

      return allPlayerStats!.map(player => {
        const playerInfo = player.player
        const playerStats = player.statistics[0]

        const finalObject: InsertPlayerFixtureStats = {
          fixtureId,
          playerId: playerInfo.id,
          season,
          leagueId,
          teamId: teamInfo!.id,
          date,
          minutes: playerStats.games.minutes,
          rating: parseFloat(playerStats.games.rating),
          goals: playerStats.goals?.total ?? 0,
          assists: playerStats.goals?.assists ?? 0,
          conceded: playerStats.goals?.conceded ?? 0,
          saves: playerStats.goals?.saves ?? 0,
          shotsTotal: playerStats.shots?.total ?? 0,
          shotsOn: playerStats.shots?.on ?? 0,
          passesTotal: playerStats.passes?.total ?? 0,
          passesKey: playerStats.passes?.key ?? 0,
          passesAccuracy: parseFloat(playerStats.passes.accuracy),
          captain: playerStats.games.captain,
          substitute: playerStats.games.substitute,
          position: playerStats.games.position,
        }

        return finalObject
      })
    },
  )

  const added = await db
    .insertInto('PlayerFixtureStats')
    .values(playerFixtureStatsToInsert)
    .returningAll()
    .execute()

  return added
}
