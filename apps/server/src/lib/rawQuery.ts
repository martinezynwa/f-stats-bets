import { sql } from 'kysely'
import { db } from '../db'

type Condition = string | null

export const buildWhereClause = (conditions: Condition[], joiner?: 'AND' | 'OR'): string => {
  const validConditions = conditions.filter(Boolean)
  if (validConditions.length === 0) return ''
  if (validConditions.length === 1) return `WHERE ${validConditions[0]}`
  return `WHERE ${validConditions.join(` ${joiner} `)}`
}

export const rawQuerySingle = async <T>(query: string): Promise<T> => {
  const result = await sql<T>`${sql.raw(query)}`.execute(db)
  return result.rows[0]
}

export const rawQueryArray = async <T>(query: string): Promise<T[]> => {
  const result = await sql<T>`${sql.raw(query)}`.execute(db)
  return result.rows.map(row => row)
}
