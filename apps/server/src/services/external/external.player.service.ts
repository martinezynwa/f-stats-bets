import { db } from 'src/db'
import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import {
  ExternalPlayerInfoResponse,
  ExternalPlayerSquadsResponse,
} from '../../types/external/external-player.types'
import { InsertPlayersValidationSchema } from '@f-stats-bets/types'
import { PlayerWithTeam, TransformPlayerResponsesOutput } from './external.player.service.types'

export const fetchPlayersSquads = async (
  input: InsertPlayersValidationSchema,
): Promise<ExternalPlayerSquadsResponse[]> => {
  const { leagueIds, teamIds } = input

  const allTeamIds = leagueIds
    ? await db
        .selectFrom('TeamToLeague')
        .select('teamId')
        .where('leagueId', 'in', leagueIds)
        .execute()
    : teamIds

  const selectedTeamIds =
    allTeamIds?.map(team => (typeof team === 'number' ? team : team.teamId)) || []

  const playersSquads: ExternalPlayerSquadsResponse[] = []

  for (const team of selectedTeamIds) {
    const response = await externalRequestHandler<ExternalPlayerSquadsResponse>({
      endpoint: ENDPOINTS.PLAYERS_SQUADS,
      params: { team },
      responseArray: [],
    })

    playersSquads.push(...response)
  }

  return playersSquads
}

export const fetchPlayersProfiles = async (
  playersWithTeam: PlayerWithTeam[],
): Promise<ExternalPlayerInfoResponse[]> => {
  const playersProfiles: ExternalPlayerInfoResponse[] = []

  for (const player of playersWithTeam) {
    const response = await externalRequestHandler<ExternalPlayerInfoResponse>({
      endpoint: ENDPOINTS.PLAYERS_PROFILES,
      params: { player: player!.playerId },
      responseArray: [],
    })

    playersProfiles.push(response[0]!)
  }

  return playersProfiles
}

export const transformPlayerResponses = (
  playerSquads: ExternalPlayerSquadsResponse[],
  playersProfiles: ExternalPlayerInfoResponse[],
  season: number,
): TransformPlayerResponsesOutput => {
  const playersToTeams = playerSquads.flatMap(({ team, players }) =>
    (players || []).map(player => ({
      playerId: player.id,
      teamId: team?.id!,
      season,
    })),
  )

  const players = playersProfiles.map(player => ({
    playerId: player.player.id,
    name: player.player.name,
    firstName: player.player.firstname,
    lastName: player.player.lastname,
    age: player.player.age,
    birthDate: player.player.birth.date,
    birthCountry: player.player.birth.country,
    height: player.player.height,
    weight: player.player.weight,
    photo: player.player.photo,
  }))

  return { players, playersToTeams }
}
