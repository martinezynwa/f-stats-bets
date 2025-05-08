const fs = require('fs')
const path = require('path')

const generatedFilePath = path.resolve(__dirname, '../src/generated.types.ts')
const databaseFilePath = path.resolve(__dirname, '../src/database.types.ts')

const content = fs.readFileSync(generatedFilePath, 'utf8')

fs.writeFileSync(generatedFilePath, content)

// Extract types
const customTypeRegex = /export type (\w+) = ([^;]+);/g
const customTypes = []
let customTypeMatch

while ((customTypeMatch = customTypeRegex.exec(content)) !== null) {
  const typeName = customTypeMatch[1]
  const typeDefinition = customTypeMatch[2]
  if (!typeName.includes('Generated') && !typeName.includes('Json')) {
    customTypes.push({ name: typeName, definition: typeDefinition })
  }
}

// Extract enums
const enumRegex = /export (?:declare )?enum (\w+) {([^}]+)}/g
const enums = []
let enumMatch

while ((enumMatch = enumRegex.exec(content)) !== null) {
  const enumName = enumMatch[1]
  const enumDefinition = enumMatch[2].trim()
  enums.push({ name: enumName, definition: enumDefinition })
}

// Extract table interfaces
const tableRegex = /export interface (\w+) {([^}]+)}/g
const tables = []
let match

while ((match = tableRegex.exec(content)) !== null) {
  const tableName = match[1]
  if (tableName !== 'DB' && tableName !== 'Generated' && tableName !== 'Timestamp') {
    tables.push(tableName)
  }
}

function createDatabaseTypesFile(tables, customTypes, enums) {
  let content = `/**
 * This file exports database types with Selectable, Insertable, and Updateable wrappers.
 * These types are derived from the generated types.
 */

import type { Selectable, Insertable, Updateable, ColumnType } from 'kysely'
import type { DB } from './generated.types'

// Export custom types
${customTypes.map(type => `export type ${type.name} = ${type.definition}`).join('\n')}

// Export enums
${enums
  .map(
    enumType =>
      `export enum ${enumType.name} {\n  ${enumType.definition
        .split(',')
        .map(v => v.trim())
        .join(',\n  ')}\n}`,
  )
  .join('\n\n')}

export interface DatabaseTypes {
${tables.map(table => `  ${table}: Selectable<DB['${table}']>`).join('\n')}
}

`

  tables.forEach(table => {
    content += `export type ${table} = Selectable<DB['${table}']>\n`
    content += `export type Insert${table} = Insertable<DB['${table}']>\n`
    content += `export type Update${table} = Updateable<DB['${table}']>\n\n`
  })

  return content
}

const databaseTypesContent = createDatabaseTypesFile(tables, customTypes, enums)
fs.writeFileSync(databaseFilePath, databaseTypesContent)

console.log('Types generated successfully, now building them...')
