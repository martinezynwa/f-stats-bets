import { FixtureWithBet } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { FixtureBetActions } from './fixture-bet-actions'
import { FixtureItem } from './fixture-item'
import { hasGameStarted } from './helpers'

import { useFixturesWithBets } from '@/api'
import { useGlobalBetCompetitionId } from '@/api/bet-competition/bet-competition.queries'
import { useCatalogStore } from '@/store'
import { CardList, ScrollViewWrapper } from '@/ui'
import { useDatePickerStore } from '@/ui/Components/HorizontalDatePicker'

export const FixturesBetsContainer = () => {
  const { leagues } = useCatalogStore()
  const { datePickerDate } = useDatePickerStore()
  const { data: globalBetCompetitionId } = useGlobalBetCompetitionId()

  const queryParams = { dateFrom: datePickerDate, dateTo: datePickerDate }

  const {
    data: fixturesData,
    isLoading: fixturesLoading,
    refetch: fixturesRefetch,
  } = useFixturesWithBets({
    input: { ...queryParams, betCompetitionId: globalBetCompetitionId! },
  })

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
    {} as Record<string, FixtureWithBet[]>,
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
              {fixtures?.map(fixture => {
                const shouldDisplayBetButtons = !hasGameStarted(fixture.date)

                return (
                  <FixtureItem
                    key={fixture.fixtureId}
                    fixture={fixture}
                    customBottomComponent={
                      shouldDisplayBetButtons ? (
                        <FixtureBetActions fixture={fixture} queryKey={['fixtures-with-bets']} />
                      ) : undefined
                    }
                  />
                )
              })}
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
