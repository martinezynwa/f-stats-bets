import { Season } from '@f-stats-bets/types'
import { rawQueryArray, buildWhereClause } from '../../lib'
import { GetSeasonsProps } from './season.service.types'

export const getSeasons = async (input: GetSeasonsProps) => {
  const { supported, isActual } = input

  const seasons = await rawQueryArray<Season>(
    `SELECT * FROM "Season" ${buildWhereClause([
      supported ? 'isSupported = true' : null,
      isActual ? 'isActual = true' : null,
    ])}`,
  )

  return seasons
}
