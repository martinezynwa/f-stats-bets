import { db } from '../../db'
import { CreateSeasonValidationSchema } from '../../routes/season.routes'

export const createSeason = async (input: CreateSeasonValidationSchema) => {
  const { season, seasonStartDate, seasonEndDate, supportedLeagues, isActual, isSupported } = input

  const added = await db
    .insertInto('Season')
    .values({
      seasonId: season,
      seasonStartDate,
      seasonEndDate,
      supportedLeagues,
      isActual,
      isSupported,
    })
    .returningAll()
    .execute()

  return added
}
