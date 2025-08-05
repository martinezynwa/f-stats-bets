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

  const playersWithTeam = playerSquadsResponse.flatMap(
    team =>
      team.players
        ?.filter(_ => team.team?.id)
        .map(player => ({
          teamId: team.team!.id,
          playerId: player.id,
        })) || [],
  )

  const playersProfilesResponse = await fetchPlayersProfiles(playersWithTeam)

  const playersProfilesData = transformPlayerResponses(
    playerSquadsResponse,
    playersProfilesResponse,
    input.season,
  )

  const addedPlayers = await insertPlayers(playersProfilesData.players)
  const addedPlayersToTeams = await insertPlayersToTeams(playersProfilesData.playersToTeams)

  return { addedPlayers, addedPlayersToTeams }
}
