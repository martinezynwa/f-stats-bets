import { FixtureWithBet, FixtureWithTeamDetails } from '@f-stats-bets/types'
import { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { FixtureItemHeader } from './fixture-item-header'

interface Props {
  fixture: FixtureWithTeamDetails | FixtureWithBet
  customRightComponent?: ReactNode
  customBottomComponent?: ReactNode
}

export const FixtureItem = ({ fixture, customRightComponent, customBottomComponent }: Props) => {
  return (
    <View>
      <FixtureItemHeader
        fixture={fixture}
        homeTeam={fixture.HomeTeam}
        awayTeam={fixture.AwayTeam}
        customRightComponent={customRightComponent}
      />
      <View style={styles.customBottomComponent}>{customBottomComponent}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  customBottomComponent: {
    marginTop: 10,
  },
})
