import { adjustDateByDays } from 'src/lib/date-and-time'
import { ExternalPlayerSquadsResponse } from '../../types/external/external-player.types'
import { fetchLatestTransfersForPlayers } from '../external/external.transfer.service'
import { getLatestPlayerClubFromTransfers } from '../external/external.transfer.service.helpers'

/**
 * Filters out players that have multiple teams in their squad(bug on external api)
 * and returns the latest club for each player
 * @param playerSquadsResponse - The player squads response from the external API
 * @returns The player squads response with the latest actual Team of each player
 */
export const filterDuplicatedPlayersInSquadsResponse = async (
  playerSquadsResponse: ExternalPlayerSquadsResponse[],
) => {
  const playersWithMultipleTeams: { playerId: number; teamIds: number[] }[] = Object.entries(
    playerSquadsResponse
      .flatMap(
        squad =>
          squad.players?.map(player => ({
            playerId: player.id,
            teamId: squad.team?.id,
          })) || [],
      )
      .filter(({ playerId, teamId }) => playerId !== 0 && teamId)
      .reduce(
        (acc, { playerId, teamId }) => {
          acc[playerId] = [...(acc[playerId] || []), teamId!]
          return acc
        },
        {} as Record<number, number[]>,
      ),
  )
    .map(([playerId, teamIds]) => ({
      playerId: Number(playerId),
      teamIds: [...new Set(teamIds)],
    }))
    .filter(({ teamIds }) => teamIds.length > 1)

  const playerIdsWithMultipleTeams = playersWithMultipleTeams.map(player => player.playerId)

  const latestTransfers = await fetchLatestTransfersForPlayers(playerIdsWithMultipleTeams)
  const dateFrom = adjustDateByDays(-1000)

  const latestClubOfPlayers = getLatestPlayerClubFromTransfers(latestTransfers, dateFrom)

  const filteredPlayerSquadsResponse = playerSquadsResponse.map(item => ({
    ...item,
    players: item.players?.filter(player => {
      const record = latestClubOfPlayers.find(
        playerWithLatestClub => playerWithLatestClub.playerId === player.id,
      )
      return !record || record.currentTeamId === item.team?.id
    }),
  }))

  return filteredPlayerSquadsResponse
}
