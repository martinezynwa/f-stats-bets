import { db } from 'src/db'

interface GetSeasonsProps {
  supported?: boolean
}

export const getSeasons = async ({ supported = false }: GetSeasonsProps) => {
  const seasons = await db
    .selectFrom('Season')
    .selectAll()
    .where('isSupported', '=', supported)
    .execute()

  return seasons
}
