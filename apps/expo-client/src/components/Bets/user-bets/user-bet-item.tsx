import { BetWithFixture } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { UserBetDetail } from './user-bet-detail'

import { FixtureItemHeader } from '@/components/Fixtures/fixture-item-header'
import { Colors } from '@/ui'

interface Props {
  bet: BetWithFixture
}

export const UserBetItem = ({ bet }: Props) => {
  return (
    <View style={styles.container}>
      <FixtureItemHeader fixture={bet.Fixture} homeTeam={bet.HomeTeam} awayTeam={bet.AwayTeam} />
      <UserBetDetail bet={bet} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.listBottomBorder,
    paddingBottom: 10,
  },
})
