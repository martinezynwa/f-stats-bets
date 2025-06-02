import { Fixture } from '@f-stats-bets/types'
import { StyleSheet, Text, View } from 'react-native'

import { useBets, useFixtures } from '@/api'
import { formatDateToCustom } from '@/lib/util/date-and-time'
import { useUserDataStore } from '@/store'
import { ScrollViewWrapper } from '@/ui'
import { useDatePickerStore } from '@/ui/Components/HorizontalDatePicker'

export const Home = () => {
  const { user } = useUserDataStore()

  const { date } = useDatePickerStore()

  const queryParams = {
    dateFrom: date,
    dateTo: formatDateToCustom(new Date('2025-05-08')),
  }

  const {
    data: fixturesData,
    isLoading: fixturesLoading,
    refetch: fixturesRefetch,
  } = useFixtures(queryParams)

  const {
    data: betsData,
    isLoading: betsLoading,
    refetch: betsRefetch,
  } = useBets({ userId: user!.id, ...queryParams })

  if (!fixturesData) {
    return <></>
  }

  if (fixturesLoading || betsLoading) {
    return <></>
  }

  const fixturesByLeagueId = fixturesData.reduce(
    (acc, fixture) => {
      acc[fixture.leagueId] = [...(acc[fixture.leagueId] || []), fixture]
      return acc
    },
    {} as Record<string, Fixture[]>,
  )

  const handleRefresh = () => {
    fixturesRefetch()
    betsRefetch()
  }

  return (
    <ScrollViewWrapper refetch={handleRefresh}>
      <View style={styles.container}>
        {Object.entries(fixturesByLeagueId).map(([leagueId, fixtures]) => (
          <View key={leagueId}>
            <Text style={styles.item}>{leagueId}</Text>
            {fixtures.map(fixture => (
              <Text style={styles.item} key={fixture.fixtureId}>
                {fixture.date}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollViewWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  item: {
    paddingVertical: 8,
    backgroundColor: 'gray',
    borderRadius: 5,
    paddingLeft: 4,
  },
})
