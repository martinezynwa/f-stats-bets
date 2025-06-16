import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { BetWithFixture } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { useTranslation } from '@/i18n/useTranslation'
import { Text } from '@/ui'

type BetStatus = 'success' | 'incorrect' | 'pending'

interface Props {
  bet: BetWithFixture
}

export const UserBetDetail = ({ bet }: Props) => {
  const { t } = useTranslation()
  const { fixtureResultBet } = bet

  const getStatus = (): BetStatus => {
    return 'pending'
  }

  const renderBet = (key: 'fixtureResultPoints') => {
    if (key === 'fixtureResultPoints') {
      const result =
        bet.fixtureResultBet === 'HOME_WIN'
          ? bet.HomeTeam.name
          : bet.fixtureResultBet === 'AWAY_WIN'
            ? bet.AwayTeam.name
            : t('bets.betResult.draw')

      return <Text>{result}</Text>
    }
  }

  return (
    <View style={styles.container}>
      {betKeys.map(key => {
        const status = getStatus()

        if (key === 'fixtureResultPoints') {
          return (
            <View key={key} style={styles.row}>
              {renderStatusIcon(status)}
              {renderText(key)}
              {renderBet(key)}
            </View>
          )
        }
      })}
    </View>
  )
}

const betKeys = ['fixtureResultPoints'] as const

const renderStatusIcon = (status: BetStatus) =>
  ({
    success: <FontAwesome5 name='check-circle' size={24} color='green' />,
    incorrect: <FontAwesome5 name='times-circle' size={24} color='red' />,
    pending: <FontAwesome5 name='question-circle' size={24} color='gray' />,
  })[status]

const renderText = (key: 'fixtureResultPoints') =>
  ({
    fixtureResultPoints: <Text>Result:</Text>,
  })[key]

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
})
