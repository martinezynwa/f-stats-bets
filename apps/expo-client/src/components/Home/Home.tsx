import { StyleSheet, Text, View } from 'react-native'

import { useBets } from '@/api'
import { ScrollViewWrapper } from '@/ui'

export const Home = () => {
  const { data: bets, isLoading } = useBets()

  if (isLoading) {
    return <></>
  }

  return (
    <ScrollViewWrapper>
      <View style={styles.container}>
        {bets?.map(bet => (
          <Text key={bet.betId} style={{ color: 'white' }}>
            {bet.betId}
          </Text>
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
