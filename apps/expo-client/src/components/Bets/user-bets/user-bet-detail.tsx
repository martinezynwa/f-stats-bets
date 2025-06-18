import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { BetWithFixture } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { useTranslation } from '@/i18n/useTranslation'
import { MIN_BET_POINTS } from '@/lib/constants'
import { Text } from '@/ui'

type BetStatus = 'success' | 'incorrect' | 'pending'

interface Props {
  bet: BetWithFixture
}

const betKeys = ['fixtureResultPoints'] as const

export const UserBetDetail = ({ bet }: Props) => {
  return (
    <View style={styles.container}>
      {betKeys.map(key => {
        const betStatus = !bet.isEvaluated
          ? 'pending'
          : bet.BetEvaluated[key]! > MIN_BET_POINTS
            ? 'success'
            : 'incorrect'

        return (
          <View key={key} style={styles.row}>
            <BetStatusIcon status={betStatus} />
            <BetTypeText betType={key} />
            <UserBetResult bet={bet} />
          </View>
        )
      })}
    </View>
  )
}

const UserBetResult = ({ bet }: { bet: BetWithFixture }) => {
  const { t } = useTranslation()

  const result =
    bet.fixtureResultBet === 'HOME_WIN'
      ? bet.HomeTeam.name
      : bet.fixtureResultBet === 'AWAY_WIN'
        ? bet.AwayTeam.name
        : t('bets.betResult.draw')

  return <Text>{result}</Text>
}

const BetStatusIcon = ({ status }: { status: BetStatus }) => {
  const icons = {
    success: <FontAwesome5 name='check-circle' size={24} color='green' />,
    incorrect: <FontAwesome5 name='times-circle' size={24} color='red' />,
    pending: <FontAwesome5 name='question-circle' size={24} color='gray' />,
  }

  return icons[status]
}

const BetTypeText = ({ betType }: { betType: (typeof betKeys)[number] }) => {
  const { t } = useTranslation()

  const textMap = {
    fixtureResultPoints: t('bets.betDetail.fixtureResultBet'),
  } as const

  return <Text>{textMap[betType]}:</Text>
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})
