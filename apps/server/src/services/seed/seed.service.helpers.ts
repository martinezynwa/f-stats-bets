import fs from 'fs'
import path from 'path'
import { db } from '../../db'
import { TableWithRelations, TableWithoutRelations } from './seed.service.types'

export const getAssetPath = (fileName: string, customPath?: string) =>
  path.join(__dirname, customPath ? `${customPath}/${fileName}` : `../../assets/seed/${fileName}`)

export const parseCsv = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content.split('\n').filter(line => line.trim())
  const headers = lines[0].split(',').map(header => header.trim())
  const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()))

  return rows.map(row =>
    headers.reduce((acc, header, index) => {
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
    }, {}),
  )
}

export const handleCsvSeed = async (
  table: TableWithoutRelations | TableWithRelations,
  filePath: string,
) => {
  const dataToInsert = parseCsv(filePath)

  await db.insertInto(table).values(dataToInsert).execute()
}
