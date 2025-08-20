import {
  CreatePlayerFromFixturesValidationSchema,
  CreatePlayerToTeamValidationSchema,
  InsertPlayer,
  InsertPlayersValidationSchema,
  InsertPlayerToTeam,
  PlayerToTeam,
} from '@f-stats-bets/types'
import { db } from '../../db'
import { rawQueryArray } from '../../lib'
import {
  fetchPlayersProfiles,
  fetchPlayersSquads,
  transformPlayerProfileResponse,
  transformPlayerResponses,
} from '../external/external.player.service'
import { getPlayerFixtureStats } from '../player-fixture-stats/player-fixture-stats.service.queries'
import { getPlayers } from './player.service.queries'
import { PlayerFixtureStatsSimple } from './player.service.types'

export const insertPlayers = async (players: InsertPlayer[]) => {
  const added = await db.insertInto('Player').values(players).returningAll().execute()

  return added
}

export const insertPlayersToTeams = async (playersToTeams: InsertPlayerToTeam[]) => {
  const added = await db.insertInto('PlayerToTeam').values(playersToTeams).returningAll().execute()

  return added
}

export const fetchAndInsertPlayers = async (input: InsertPlayersValidationSchema) => {
  const playerSquadsResponse = await fetchPlayersSquads(input)

  const existingPlayers = await getPlayers({})
  const existingPlayersIds = existingPlayers.map(player => player.playerId)

  const playerIds = playerSquadsResponse.flatMap(
    team =>
      team.players
        ?.filter(player => team.team?.id && !existingPlayersIds.includes(player.id))
        .map(player => player.id) || [],
  )

  const playersProfilesResponse = playerIds.length > 0 ? await fetchPlayersProfiles(playerIds) : []

  const playersProfilesData = transformPlayerResponses(
    playerSquadsResponse,
    playersProfilesResponse,
    input.season,
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
    return { playerId, teamId, season }
  })

  const playersInDb = await getPlayers({ playerIds: playerToTeamObjects.map(p => p.playerId) })
  const playerIdsInDb = playersInDb.map(player => player.playerId)

  const playerToTeamToInsert = playerToTeamObjects.filter(p => playerIdsInDb.includes(p.playerId))

  const added = await insertPlayersToTeams(playerToTeamToInsert)

  return added
}
