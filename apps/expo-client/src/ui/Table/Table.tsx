import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { Text, TextVariant } from '../Typography/Text'
import { Colors } from '../colors'

import { Pagination } from './components/Pagination'
import { TableHeader } from './components/TableHeader'
import { TableRow } from './components/TableRow'

export interface Column<T> {
  id: string
  label: string
  width: number
  renderCell?: (item: T) => ReactNode
  getValue: (item: T) => string | number
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string | number
  rowTextVariant?: TextVariant
  onRowPress?: (item: T) => void
  isLoading?: boolean
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const Table = <T extends object>({
  columns,
  data,
  keyExtractor,
  rowTextVariant = 'sm',
  onRowPress,
  isLoading = false,
  totalPages,
  currentPage,
  onPageChange,
}: Props<T>) => {
  if (isLoading) return null

  if (data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyState]}>
        <Text variant={rowTextVariant} color='textFaded'>
          No data available
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TableHeader columns={columns} />

        {data.map(item => (
          <TableRow
            key={keyExtractor(item)}
            item={item}
            columns={columns}
            onRowPress={onRowPress}
          />
        ))}
      </View>

      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.box,
    borderRadius: 12,
    overflow: 'hidden',
  },
  content: {
    width: '100%',
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  },
})
