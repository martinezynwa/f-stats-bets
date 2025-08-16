import {
  InsertPlayer,
  InsertPlayersValidationSchema,
  InsertPlayerToTeam,
} from '@f-stats-bets/types'
import {
  fetchPlayersProfiles,
  fetchPlayersSquads,
  transformPlayerResponses,
} from '../external/external.player.service'
import { db } from '../../db'
import { getPlayers } from './player.service.queries'

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

  const existingPlayers = await getPlayers()
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
