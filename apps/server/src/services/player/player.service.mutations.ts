import {
  CreateHistoricalPlayerSeasonStatsValidationSchema,
  CreatePlayerFromFixturesValidationSchema,
  CreatePlayerToTeamHistoryValidationSchema,
  CreatePlayerToTeamValidationSchema,
  InsertPlayer,
  InsertPlayersValidationSchema,
  InsertPlayerToTeam,
  PlayerToTeam,
} from '@f-stats-bets/types'
import { db } from '../../db'
import { rawQueryArray } from '../../lib'
import {
  fetchPlayerSeasonStatistics,
  fetchPlayersProfiles,
  fetchPlayersSquads,
  fetchPlayersTeamsHistory,
  transformPlayerProfileResponse,
  transformPlayerResponses,
} from '../external/external.player.service'
import { getPlayerFixtureStats } from '../player-fixture-stats/player-fixture-stats.service.queries'
import { getPlayers, getPlayerToTeam } from './player.service.queries'
import { PlayerFixtureStatsSimple } from './player.service.types'
import { getLeagues } from '../league/league.service.queries'
import { getCurrentYear } from '../../lib/date-and-time'
import { createAndInsertPlayerSeasonStatsFromExternalApi } from '../player-season-stats/player-season-stats.service.mutations'
import { getTeamIds } from '../team/team.service.queries'

export const insertPlayers = async (players: InsertPlayer[]) => {
  const added = await db.insertInto('Player').values(players).returningAll().execute()

  return added
}

export const insertPlayersToTeams = async (playersToTeams: InsertPlayerToTeam[]) => {
  const added = await db.insertInto('PlayerToTeam').values(playersToTeams).returningAll().execute()

  return added
}

export const updateManyPlayerToTeam = async (playerToTeam: PlayerToTeam[]) => {
  const updated = await db.transaction().execute(async trx => {
    for (const player of playerToTeam) {
      await trx
        .updateTable('PlayerToTeam')
        .set({ ...player, isActual: false })
        .where('season', '=', player.season)
        .where('playerId', '=', player.playerId)
        .where('teamId', '=', player.teamId)
        .execute()
    }
  })

  return updated
}

export const fetchAndInsertPlayers = async (input: InsertPlayersValidationSchema) => {
  const { season, shouldMockResponse } = input

  const playerSquadsResponse = await fetchPlayersSquads(input)

  const existingPlayers = await getPlayers()
  const existingPlayersIds = existingPlayers.map(player => player.playerId)

  const playerIds = [
    ...new Set(
      playerSquadsResponse.flatMap(
        team =>
          team.players
            ?.filter(
              player => team.team?.id && !existingPlayersIds.includes(player.id) && player.id !== 0,
            )
            .map(player => player.id) || [],
      ),
    ),
  ]

  const playersProfilesResponse =
    playerIds.length > 0 ? await fetchPlayersProfiles(playerIds, shouldMockResponse) : []

  const playersProfilesData = transformPlayerResponses(
    playerSquadsResponse,
    playersProfilesResponse,
    season,
  )

  const addedPlayers =
    playersProfilesData.players.length > 0 ? await insertPlayers(playersProfilesData.players) : []

  const addedPlayersToTeams =
    playersProfilesData.playersToTeams.length > 0
      ? await insertPlayersToTeams(playersProfilesData.playersToTeams)
      : []

  return { addedPlayers, addedPlayersToTeams }
}

export const addNewPlayers = async (input: CreatePlayerFromFixturesValidationSchema) => {
  const { createdPlayers, playerFixtureStats } = await createPlayersFromFixtures(input)

  const createdPlayerToTeam = await createPlayerToTeamFromFixtures(input, playerFixtureStats)

  return { createdPlayers, createdPlayerToTeam }
}

export const createPlayersFromFixtures = async (
  input: CreatePlayerFromFixturesValidationSchema,
  playerFixtureStatsInput?: PlayerFixtureStatsSimple[],
) => {
  const playerFixtureStats = playerFixtureStatsInput
    ? playerFixtureStatsInput
    : await getPlayerFixtureStats<PlayerFixtureStatsSimple>(input, '"playerId", "teamId", "season"')

  if (playerFixtureStats.length === 0) return { createdPlayers: [], playerFixtureStats: [] }

  const playerIds = [...new Set(playerFixtureStats.map(p => p.playerId))]

  const existingPlayers = await getPlayers({ playerIds })

  const newPlayerIds = playerIds.filter(
    id => !existingPlayers.some(player => player.playerId === id),
  )

  const playerProfiles = await fetchPlayersProfiles(newPlayerIds)

  const playersToInsert = transformPlayerProfileResponse(playerProfiles.filter(Boolean))

  const createdPlayers = await insertPlayers(playersToInsert)

  return { createdPlayers, playerFixtureStats }
}

export const createPlayerToTeamFromFixtures = async (
  input: CreatePlayerToTeamValidationSchema,
  playerFixtureStatsInput?: PlayerFixtureStatsSimple[],
) => {
  const playerFixtureStats = playerFixtureStatsInput
    ? playerFixtureStatsInput
    : await getPlayerFixtureStats<PlayerFixtureStatsSimple>(input, '"playerId", "teamId", "season"')

  if (playerFixtureStats.length === 0) return []

  const existingPlayerToTeam = await getExistingPlayerToTeamRelationships(playerFixtureStats)

  return existingPlayerToTeam
}

export const getExistingPlayerToTeamRelationships = async (
  playerFixtureStats: PlayerFixtureStatsSimple[],
) => {
  if (playerFixtureStats.length === 0) return []

  const playerTeamSeasonPairsSet = new Set(
    playerFixtureStats.map(p => `(${p.playerId}, ${p.teamId}, ${p.season})`),
  )

  const existingPlayerToTeam = await rawQueryArray<PlayerToTeam>(`
    SELECT * FROM "PlayerToTeam"
    WHERE ("playerId", "teamId", "season") IN (${[...playerTeamSeasonPairsSet].join(',')})
  `)

  const existingPlayerToTeamPairs = existingPlayerToTeam.map(
    p => `(${p.playerId}, ${p.teamId}, ${p.season})`,
  )

  const newPlayerToTeamPairs = [...playerTeamSeasonPairsSet].filter(
    pair => !existingPlayerToTeamPairs.includes(pair),
  )

  const playerToTeamObjects = newPlayerToTeamPairs.map(pair => {
    const [playerId, teamId, season] = pair.replace(/[()]/g, '').split(',').map(Number)
    return { playerId, teamId, season, isActual: true }
  })

  const playersInDb = await getPlayers({ playerIds: playerToTeamObjects.map(p => p.playerId) })
  const playerIdsInDb = playersInDb.map(player => player.playerId)

  const playerToTeamToInsert = playerToTeamObjects.filter(p => playerIdsInDb.includes(p.playerId))

  const added = await insertPlayersToTeams(playerToTeamToInsert)

  return added
}

export const createPlayerToTeamHistory = async (
  input: CreatePlayerToTeamHistoryValidationSchema,
) => {
  const { playerSquadsSeason, seasonHistoryInYears, leagueIds, ignoredSeasons } = input
  const allowedSeasons = Array.from(
    { length: seasonHistoryInYears },
    (_, i) => getCurrentYear() - i,
  )

  const selectedLeagueIds = leagueIds ?? (await getLeagues()).map(l => l.leagueId)

  const playerSquadsResponse = await fetchPlayersSquads({
    season: playerSquadsSeason,
    leagueIds: selectedLeagueIds,
  })

  const playerIds = playerSquadsResponse.flatMap(
    team => team.players?.map(player => player.id) || [],
  )

  const playersTeamsHistory = await fetchPlayersTeamsHistory(playerIds)

  const playerToTeamObjects = playersTeamsHistory.flatMap(({ playerId, response }) =>
    response.flatMap(r =>
      r.seasons
        .filter(s => allowedSeasons.includes(s) && !ignoredSeasons?.includes(s))
        .map(season => ({
          playerId,
          season,
          teamId: r.team.id,
          isActual: season === playerSquadsSeason,
        })),
    ),
  )

  const added = await insertPlayersToTeams(playerToTeamObjects)

  return added
}

/**
 * Should be used for fetching data from completed seasons only.
 */
export const createHistoricalPlayerSeasonStats = async (
  input: CreateHistoricalPlayerSeasonStatsValidationSchema,
) => {
  const { firstSeason, totalSeasons, playerIds } = input

  const seasons = Array.from({ length: totalSeasons }, (_, i) => firstSeason - i)

  let selectedPlayerIds: number[] = []

  if (!playerIds || playerIds.length === 0) {
    const playerToTeam = await getPlayerToTeam({ isActual: true })
    selectedPlayerIds = [...new Set(playerToTeam.map(player => player.playerId))]
  } else {
    selectedPlayerIds = playerIds
  }

  const playerSeasonStatistics = await fetchPlayerSeasonStatistics({
    playerIds: selectedPlayerIds,
    seasons,
  })

  const supportedTeamIds = await getTeamIds()

  const playerSeasonStatisticsWithSupportedTeams = playerSeasonStatistics.flatMap(playerStats => {
    return {
      player: playerStats.player,
      statistics: playerStats.statistics.filter(team => supportedTeamIds.includes(team.team.id)),
    }
  })

  const createdPlayerSeasonStats = await createAndInsertPlayerSeasonStatsFromExternalApi(
    playerSeasonStatisticsWithSupportedTeams,
  )

  const playerToTeamToInsert = createdPlayerSeasonStats.reduce(
    (acc, stats) => {
      const key = `${stats.playerId}-${stats.teamId}-${stats.season}`
      if (!acc.some(item => `${item.playerId}-${item.teamId}-${item.season}` === key)) {
        acc.push({
          playerId: stats.playerId,
          season: stats.season,
          teamId: stats.teamId,
          isActual: false,
        })
      }
      return acc
    },
    [] as { playerId: number; teamId: number; season: number; isActual: boolean }[],
  )

  const createdPlayerToTeam = await insertPlayersToTeams(playerToTeamToInsert)

  return { createdPlayerSeasonStats, createdPlayerToTeam }
}
