import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { BetWithFixture } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { Text } from '@/ui'

interface Props {
  bet: BetWithFixture
}

type BetStatus = 'success' | 'incorrect' | 'pending'

export const betKeys = ['fixtureResultPoints'] as const

export const UserBetDetail = ({ bet }: Props) => {
  const { fixtureResultBet } = bet

  const mapData = betKeys.map(key => {
    const status = 'pending'

    if (key === 'fixtureResultPoints') {
      return (
        <View key={key}>
          {getStatusIcon(status)}
          <Text>{getText(key)}</Text>
        </View>
      )
    }
  })

  return <View style={styles.container}>{mapData}</View>
}

const getStatusIcon = (status: BetStatus) =>
  ({
    success: <FontAwesome5 name='check-circle' size={24} color='green' />,
    incorrect: <FontAwesome5 name='times-circle' size={24} color='red' />,
    pending: <FontAwesome5 name='question-circle' size={24} color='white' />,
  })[status]

export const getText = (
  key: 'fixtureResultPoints' | 'fixtureGoalsPoints' | 'fixtureScorersPoints',
) =>
  ({
    fixtureResultPoints: 'Result',
    fixtureGoalsPoints: 'Goals',
    fixtureScorersPoints: '',
  })[key]

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
})
