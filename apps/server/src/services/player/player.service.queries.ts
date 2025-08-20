import { Player } from '@f-stats-bets/types'
import { buildWhereClause, rawQueryArray } from 'src/lib'
import { GetPlayers } from './player.service.types'

export const getPlayers = async (input?: GetPlayers) => {
  const players = await rawQueryArray<Player>(`
    SELECT * FROM "Player"${buildWhereClause([
      input?.playerIds?.length ? `"playerId" IN (${input.playerIds.map(Number).join(',')})` : null,
    ])}`)

  return players
}
