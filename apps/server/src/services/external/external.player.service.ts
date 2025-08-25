import {
  FetchPlayerSeasonStatisticsValidationSchema,
  InsertPlayersValidationSchema,
} from '@f-stats-bets/types'
import { db } from '../../db'
import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import {
  CustomPlayerFixtureDetail,
  ExternalPlayerFixtureStatisticsResponse,
  FixtureDetail,
} from '../../types/external/external-player-fixture-stats.types'
import {
  ExternalPlayerInfoResponse,
  ExternalPlayerInfoWithStatsResponse,
  ExternalPlayerSquadsResponse,
  ExternalPlayersTeamsResponse,
  ExternalPlayersTeamsResponseWithPlayerId,
} from '../../types/external/external-player.types'
import { TransformPlayerResponsesOutput } from './external.player.service.types'
import { stopFunction } from 'src/lib/util'

export const fetchPlayersSquads = async (
  input: InsertPlayersValidationSchema,
): Promise<ExternalPlayerSquadsResponse[]> => {
  const { leagueIds, teamIds, shouldMockResponse } = input

  const allTeamIds = leagueIds
    ? await db
        .selectFrom('TeamToLeague')
        .select('teamId')
        .where('leagueId', 'in', leagueIds)
        .execute()
    : teamIds

  if (allTeamIds?.length === 0) {
    throw new Error('No teams found')
  }

  const selectedTeamIds =
    allTeamIds?.map(team => (typeof team === 'number' ? team : team.teamId)) || []

  const playersSquads: ExternalPlayerSquadsResponse[] = []

  for (const team of selectedTeamIds) {
    const response = await externalRequestHandler<ExternalPlayerSquadsResponse>({
      endpoint: ENDPOINTS.PLAYERS_SQUADS,
      params: { team },
      responseArray: [],
      shouldMockResponse,
    })

    playersSquads.push(...response)
  }

  //bug, sometimes squad has player with id 0 which is not valid
  const validPlayerSquadValues = playersSquads.map(item => ({
    ...item,
    players: item.players?.filter(player => player.id !== 0) || [],
  }))

  return validPlayerSquadValues
}

export const fetchPlayersProfiles = async (
  playerIds: number[],
  shouldMockResponse?: boolean,
): Promise<ExternalPlayerInfoResponse[]> => {
  const playersProfiles: ExternalPlayerInfoResponse[] = []

  for (const playerId of playerIds) {
    if (!shouldMockResponse) {
      await stopFunction(1000)
    }

    const response = await externalRequestHandler<ExternalPlayerInfoResponse>({
      endpoint: ENDPOINTS.PLAYERS_PROFILES,
      params: { player: playerId },
      responseArray: [],
      shouldMockResponse,
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
      isActual: true,
    })),
  )

  const players = transformPlayerProfileResponse(playersProfiles.filter(Boolean))

  return { players, playersToTeams }
}

export const transformPlayerProfileResponse = (input: ExternalPlayerInfoResponse[]) =>
  input.map(player => ({
    playerId: player.player.id,
    name: player.player.name ?? '',
    firstName: player.player.firstname,
    lastName: player.player.lastname,
    age: player.player.age,
    birthDate: player.player.birth.date,
    birthCountry: player.player.birth.country,
    height: player.player.height,
    weight: player.player.weight,
    photo: player.player.photo,
  }))

export const fetchPlayerFixtureStats = async (fixtureDetails: FixtureDetail[]) => {
  const playerFixtureStats: CustomPlayerFixtureDetail[] = []

  for (const fixtureDetail of fixtureDetails) {
    const response = await externalRequestHandler<ExternalPlayerFixtureStatisticsResponse>({
      endpoint: ENDPOINTS.PLAYER_FIXTURE_STATS,
      params: { fixture: fixtureDetail.fixtureId },
      responseArray: [],
    })

    playerFixtureStats.push({
      fixtureDetail,
      response,
    })
  }

  return playerFixtureStats
}

export const fetchPlayersTeamsHistory = async (playerIds: number[]) => {
  const playersTeams: ExternalPlayersTeamsResponseWithPlayerId[] = []

  for (const playerId of playerIds) {
    const response = await externalRequestHandler<ExternalPlayersTeamsResponse>({
      endpoint: ENDPOINTS.PLAYERS_TEAMS,
      params: { player: playerId },
      responseArray: [],
    })

    playersTeams.push({
      playerId,
      response,
    })
  }

  return playersTeams
}

export const fetchPlayerSeasonStatistics = async (
  input: FetchPlayerSeasonStatisticsValidationSchema,
) => {
  const { playerIds, seasons } = input

  const playerSeasonStatistics: ExternalPlayerInfoWithStatsResponse[] = []

  for (const playerId of playerIds) {
    for (const season of seasons) {
      const response = await externalRequestHandler<ExternalPlayerInfoWithStatsResponse>({
        endpoint: ENDPOINTS.PLAYER_SEASON_STATISTICS,
        params: { id: playerId, season },
        responseArray: [],
      })

      playerSeasonStatistics.push(...response)
    }
  }

  return playerSeasonStatistics
}
