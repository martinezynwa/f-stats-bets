import fs from 'fs'
import { sql } from 'kysely'
import path from 'path'
import { db } from '../../db'
import { seedFromCSV } from './seed.service.helpers'
import { TableName } from './seed.service.types'

export const initDatabase = async () => {
  try {
    const schemaPath = path.join(__dirname, '../../migrations/database.schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    await sql.raw(schema).execute(db)
    return { success: true }
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

export const seedBaseData = async (tableNames: TableName[]) => {
  try {
    for (const tableName of tableNames) {
      await seedFromCSV(tableName, path.join(__dirname, `../../assets/seed/${tableName}.csv`))
    }

    return { success: true, message: 'Successfully seeded Season data' }
  } catch (error) {
    console.error('Error seeding Season data:', error)
    throw error
  }
}
