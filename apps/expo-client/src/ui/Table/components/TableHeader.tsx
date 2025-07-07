import { Dimensions, StyleSheet, View } from 'react-native'

import { Text } from '../../Typography/Text'
import { Column } from '../Table'

export interface TableHeaderProps<T> {
  columns: Column<T>[]
}

export const TableHeader = <T extends object>({ columns }: TableHeaderProps<T>) => {
  return (
    <View style={styles.container}>
      {columns.map(column => {
        const width = (column.width / 100) * screenWidth

        return (
          <View key={column.id} style={[styles.cell, { width }]}>
            <Text fontWeight='bold' numberOfLines={1} ellipsizeMode='tail'>
              {column.label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

const screenWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
  },
})
