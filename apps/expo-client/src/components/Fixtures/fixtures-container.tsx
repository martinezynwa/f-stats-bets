import { FixtureWithTeamDetails } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { FixtureItem } from './fixture-item'

import { useFixtures } from '@/api'
import { useCatalogStore } from '@/store'
import { CardList, ScrollViewWrapper } from '@/ui'
import { useDatePickerStore } from '@/ui/Components/HorizontalDatePicker'

export const FixturesContainer = () => {
  const { datePickerDate } = useDatePickerStore()
  const { leagues } = useCatalogStore()

  const queryParams = { dateFrom: datePickerDate, dateTo: datePickerDate }

  const {
    data: fixturesData,
    isLoading: fixturesLoading,
    refetch: fixturesRefetch,
  } = useFixtures(queryParams)

  if (!fixturesData) {
    return <></>
  }

  if (fixturesLoading) {
    return <></>
  }

  const handleRefresh = () => {
    fixturesRefetch()
  }

  const fixturesByLeagueId = fixturesData.reduce(
    (acc, fixture) => {
      acc[fixture.leagueId] = [...(acc[fixture.leagueId] || []), fixture]
      return acc
    },
    {} as Record<string, FixtureWithTeamDetails[]>,
  )

  return (
    <ScrollViewWrapper refetch={handleRefresh}>
      {Object.entries(fixturesByLeagueId).map(([leagueId, fixtures]) => {
        const league = leagues[leagueId]

        return (
          <CardList
            key={leagueId}
            headerImageUri={league?.logo}
            headerText={league?.name}
            subText={league?.country}
          >
            <View style={styles.fixtures}>
              {fixtures?.map(fixture => <FixtureItem key={fixture.fixtureId} fixture={fixture} />)}
            </View>
          </CardList>
        )
      })}
    </ScrollViewWrapper>
  )
}

const styles = StyleSheet.create({
  fixtures: {
    paddingHorizontal: 8,
    gap: 10,
  },
})
