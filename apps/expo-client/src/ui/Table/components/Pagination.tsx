import { StyleSheet, View, Pressable } from 'react-native'

import { Text } from '../../Typography/Text'

export interface Props {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ totalPages, currentPage, onPageChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.arrowButton}
        onPress={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text variant='sm' style={[styles.arrow, currentPage === 1 && styles.disabled]}>
          ‹
        </Text>
      </Pressable>

      <Text color='white'>{`${currentPage} / ${totalPages}`}</Text>

      <Pressable
        style={styles.arrowButton}
        onPress={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text variant='sm' style={[styles.arrow, currentPage === totalPages && styles.disabled]}>
          ›
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 24,
  },
  arrowButton: {
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  arrow: {
    color: 'white',
    fontSize: 24,
  },
  disabled: { opacity: 0.3 },
})
