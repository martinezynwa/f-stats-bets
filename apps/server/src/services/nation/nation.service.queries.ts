import { db } from 'src/db'

export const getNations = async () => {
  const nations = await db.selectFrom('Nation').selectAll().execute()

  return nations
}
