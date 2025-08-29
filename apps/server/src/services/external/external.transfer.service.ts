import { adjustDateByDays } from '../../lib/date-and-time'
import { ENDPOINTS } from '../../constants/enums'
import { externalRequestHandler } from '../../lib/externalRequestHandler'
import { ExternalTransferResponse } from '../../types/external/external-transfer.types'
import { getTeams } from '../team/team.service.queries'
import { PLAYER_TRANSFER_DATE_FROM_DAYS } from '../../constants/constants'
import { getLatestPlayerClubFromTransfers } from './external.transfer.service.helpers'
import { getPlayerStatus, getPlayerToTeam } from '../player/player.service.queries'
import { insertPlayersToTeams, updateManyPlayerToTeam } from '../player/player.service.mutations'
import { createNewTeamsBasedOnTransfers } from '../team/team.service.mutations'

export const fetchLatestTransfersForPlayers = async (playerIds: number[]) => {
  const transferData: ExternalTransferResponse[] = []

  for (const player of playerIds) {
    const data = await externalRequestHandler<ExternalTransferResponse>({
      endpoint: ENDPOINTS.TRANSFERS,
      params: { player },
      responseArray: [],
    })
    transferData.push(...data)
  }

  return transferData
}

export const fetchLatestTransfersForTeams = async (teamIds: number[]) => {
  const transferData: ExternalTransferResponse[] = []

  for (const team of teamIds) {
    const data = await externalRequestHandler<ExternalTransferResponse>({
      endpoint: ENDPOINTS.TRANSFERS,
      params: { team },
      responseArray: [],
    })

    transferData.push(...data)
  }

  return transferData
}

export const handleTransfers = async (season: number) => {
  const teams = await getTeams({ season })
  const teamIds = teams.map(team => team.teamId)

  const transfers = await fetchLatestTransfersForTeams(teamIds)

  const dateFrom = adjustDateByDays(-PLAYER_TRANSFER_DATE_FROM_DAYS)

  const playersFromTransfers = getLatestPlayerClubFromTransfers(transfers, dateFrom)
  const playerIdsFromTransfers = playersFromTransfers.map(p => p.playerId)

  const playerToTeamFromDb = await getPlayerToTeam({
    season,
    playerIds: playerIdsFromTransfers,
    isActual: true,
  })
  const playersWithoutTeam = await getPlayerStatus({
    playerIds: playerIdsFromTransfers,
    isWithoutClub: true,
    isActive: true,
  })

  const playersFromTransfersMap = new Map(playersFromTransfers.map(p => [p.playerId, p]))

  const allPlayers = [
    ...playerToTeamFromDb,
    ...playersWithoutTeam.map(p => ({ teamId: null, playerId: p.playerId })),
  ]

  const playersWithNewTeam = allPlayers
    .map(player => {
      const playerTransferInfo = playersFromTransfersMap.get(player.playerId)

      if (
        (playerTransferInfo?.currentTeamId && !player.teamId) ||
        playerTransferInfo?.currentTeamId !== player.teamId
      ) {
        return playerTransferInfo
      }
    })
    .filter(Boolean)

  if (playersWithNewTeam.length === 0) {
    return []
  }

  const newPlayerToTeam = playersWithNewTeam.map(player => ({
    playerId: player!.playerId,
    teamId: player!.currentTeamId,
    season,
    isActual: true,
  }))

  const newPlayerToTeamKeys = newPlayerToTeam.map(p => `${p.playerId}-${p.teamId}-${season}`)

  const teamIdsFromNewPlayerToTeam = newPlayerToTeam.map(p => p.teamId)
  await createNewTeamsBasedOnTransfers(teamIdsFromNewPlayerToTeam)

  const newPlayerToTeamInserted = await insertPlayersToTeams(newPlayerToTeam)

  const playerToTeamNoLongerActual = playerToTeamFromDb
    .filter(p => p.isActual)
    .filter(p => !newPlayerToTeamKeys.includes(`${p.playerId}-${p.teamId}-${season}`))

  await updateManyPlayerToTeam(playerToTeamNoLongerActual)

  return newPlayerToTeamInserted
}
