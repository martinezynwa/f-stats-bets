import { Player, PlayerStatus, PlayerToTeam } from '@f-stats-bets/types'
import { buildWhereClause, rawQueryArray } from 'src/lib'
import { GetPlayers, GetPlayerStatus, GetPlayerToTeam } from './player.service.types'

export const getPlayers = async (input?: GetPlayers) => {
  const players = await rawQueryArray<Player>(`
    SELECT * FROM "Player"
    ${buildWhereClause([
      input?.playerIds?.length ? `"playerId" IN (${input.playerIds.map(Number).join(',')})` : null,
    ])}`)

  return players
}

export const getPlayerToTeam = async (input: GetPlayerToTeam) => {
  const { season, playerIds, isActual } = input

  const playerToTeam = await rawQueryArray<PlayerToTeam>(
    `SELECT * FROM "PlayerToTeam" ${buildWhereClause(
      [
        season ? `"season" = ${season}` : null,
        playerIds?.length ? `"playerId" IN (${playerIds.map(Number).join(',')})` : null,
        isActual ? `"isActual" = ${isActual}` : null,
      ],
      'AND',
    )}`,
  )

  return playerToTeam
}

export const getPlayerStatus = async (input: GetPlayerStatus) => {
  const { playerIds, isActive, isWithoutClub } = input

  const playerStatus = await rawQueryArray<PlayerStatus>(
    `SELECT * FROM "PlayerStatus" ${buildWhereClause(
      [
        `"playerId" IN (${playerIds.join(',')})`,
        isActive ? `"isActive" = ${isActive}` : null,
        isWithoutClub ? `"isWithoutClub" = ${isWithoutClub}` : null,
      ],
      'AND',
    )}`,
  )

  return playerStatus
}
