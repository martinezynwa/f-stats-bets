import { sql } from 'kysely'
import { db } from '../db'

export const rawQuerySingle = async <T>(query: string): Promise<T> => {
  const result = await sql<T>`${sql.raw(query)}`.execute(db)
  return result.rows[0]
}

export const rawQueryArray = async <T>(query: string): Promise<T[]> => {
  const result = await sql<T>`${sql.raw(query)}`.execute(db)
  return result.rows.map(row => row)
}
