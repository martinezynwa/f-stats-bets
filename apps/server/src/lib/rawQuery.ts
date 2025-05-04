import { sql } from 'kysely'
import { db } from 'src/db'

type QueryResult<T> = {
  result: T
}

export const rawQuerySingle = async <T>(query: string): Promise<T> => {
  const result = await sql<QueryResult<T>>`${sql.raw(query)}`.execute(db)
  return result.rows[0].result
}

export const rawQueryArray = async <T>(query: string): Promise<T[]> => {
  const result = await sql<QueryResult<T>>`${sql.raw(query)}`.execute(db)
  return result.rows.map(row => row.result)
}
