import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Text } from '../../Typography/Text'
import { Column } from '../Table'

interface TableRowProps<T> {
  item: T
  columns: Column<T>[]
  onRowPress?: (item: T) => void
}

export const TableRow = <T extends object>({ item, columns, onRowPress }: TableRowProps<T>) => {
  const rowContent = (
    <View style={styles.container}>
      {columns.map(column => {
        const width = (column.width / 100) * screenWidth
        const value = column.getValue(item)

        return (
          <View key={column.id} style={[styles.cell, { width }]}>
            {column.renderCell ? (
              column.renderCell(item)
            ) : (
              <Text numberOfLines={1} ellipsizeMode='tail'>
                {value}
              </Text>
            )}
          </View>
        )
      })}
    </View>
  )

  if (onRowPress) {
    return <TouchableOpacity onPress={() => onRowPress(item)}>{rowContent}</TouchableOpacity>
  }

  return rowContent
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
