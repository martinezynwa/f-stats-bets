import { BetCompetitionStandings as TBetCompetitionStandings } from '@f-stats-bets/types'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { useBetCompetitionStandings } from '@/api'
import { ScrollViewWrapper, Table } from '@/ui'

export const BetCompetitionStandings = () => {
  const { id } = useLocalSearchParams()

  const [filter, setFilter] = useState<{ page: number }>({ page: 1 })

  const { data, isLoading, refetch } = useBetCompetitionStandings(id as string, filter.page)

  if (isLoading) return null
  if (!data || data.items.length === 0) return null

  return (
    <ScrollViewWrapper refetch={() => refetch()}>
      <View style={styles.container}>
        <Table<TBetCompetitionStandings>
          data={data.items}
          keyExtractor={item => item.userId}
          totalPages={data.totalPages}
          currentPage={filter.page}
          onPageChange={page => setFilter({ ...filter, page })}
          isLoading={isLoading}
          columns={[
            {
              id: 'position',
              label: '#',
              width: 15,
              getValue: item => item.position,
            },
            {
              id: 'userName',
              label: 'Player',
              width: 60,
              getValue: item => item.userName,
            },
            {
              id: 'points',
              label: 'Points',
              width: 25,
              getValue: item => item.points,
            },
          ]}
        />
      </View>
    </ScrollViewWrapper>
  )
}

const styles = StyleSheet.create({
  container: { paddingTop: 16 },
})
