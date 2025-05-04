import { StyleSheet, Text, View } from 'react-native'

import { useFixturesWithBets } from '@/api'
import { getCurrentDate } from '@/lib/util/date-and-time'
import { ScrollViewWrapper } from '@/ui'

export const Home = () => {
  const { data } = useFixturesWithBets({
    dateFrom: getCurrentDate(),
    dateTo: getCurrentDate(),
  })

  if (!data) {
    return <></>
  }

  return (
    <ScrollViewWrapper>
      <View style={styles.container}>
        {Object.entries(data).map(([leagueId, fixtures]) => (
          <View key={leagueId}>
            <Text style={styles.item}>{leagueId}</Text>
            {fixtures.map(fixture => (
              <Text style={styles.item} key={fixture.Fixture.fixtureId}>
                {fixture.Fixture.date}
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
