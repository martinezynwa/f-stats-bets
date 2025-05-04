import fs from 'fs'
import { db } from '../../db'
import { TableName } from './seed.service.types'

export const seedFromCSV = async (table: TableName, filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(header => header.trim())
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()))

  for (const row of rows) {
    const data = headers.reduce((acc, header, index) => {
      const value = row[index]

      if (value === '') return { ...acc, [header]: null }

      if (header === 'providerId') {
        return { ...acc, [header]: value }
      }

      if (value === 'true' || value === 'false') {
        return { ...acc, [header]: value === 'true' }
      }

      if (value.startsWith('{') || value.startsWith('[')) {
        return { ...acc, [header]: JSON.parse(value) }
      }

      return { ...acc, [header]: value }
    }, {})

    console.log(data)

    await db.insertInto(table).values(data).execute()
  }
}
