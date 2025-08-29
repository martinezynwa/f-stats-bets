import { formatDate, isSelectedDateWithinPeriod } from '../../lib/date-and-time'
import { ExternalTransferResponse, Transfer } from '../../types/external/external-transfer.types'

export type PlayersWithActualClub = {
  playerId: number
  name: string
  currentTeamId: number
}

export type TransferWithPlayerInfo = Transfer & {
  playerId: number
  name: string
}

export const isOldDateFormat = (date: string) => date.length === 6
export const isDateWrong = (date: string) => Number(date.split('-')[0]) > 2090

export const getLatestPlayerClubFromTransfers = (
  playerTransfers: ExternalTransferResponse[],
  dateFrom: string,
): PlayersWithActualClub[] => {
  const data = playerTransfers
    .map(item => {
      const transfers = item.transfers
        .filter(
          transfer =>
            !isOldDateFormat(transfer.date) &&
            isSelectedDateWithinPeriod(transfer.date, dateFrom, formatDate(new Date())),
        )
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      return transfers.length > 0
        ? {
            playerId: item.player.id,
            name: item.player.name,
            currentTeamId: transfers[0]?.teams.in.id || 0,
          }
        : null
    })
    .filter((item): item is PlayersWithActualClub => item !== null)

  return data
}
