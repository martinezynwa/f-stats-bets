import { Feather } from '@expo/vector-icons'
import { Fixture, FIXTURE_STATUS, FixtureStatus, TeamDetailSimple } from '@f-stats-bets/types'
import { ReactNode } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'

import { useTranslation } from '@/i18n/useTranslation'
import { formatDateStringToShortTime } from '@/lib/util'
import { Colors, LinkWrapper, Text } from '@/ui'

interface Props {
  customRightComponent?: ReactNode
  fixture: Fixture
  homeTeam: TeamDetailSimple
  awayTeam: TeamDetailSimple
}

export const FixtureItemHeader = ({ fixture, homeTeam, awayTeam, customRightComponent }: Props) => {
  const { t } = useTranslation()

  const { date } = fixture

  const {
    gameFinished,
    isPostponed,
    homeTeamGoalsIndicator,
    awayTeamGoalsIndicator,
    isAwayWinner,
    isHomeWinner,
    isDraw,
  } = getFixtureDetails(fixture)

  const fontColorHome = gameFinished && (isAwayWinner || isDraw) ? 'gray' : 'white'
  const fontColorAway = gameFinished && (isHomeWinner || isDraw) ? 'gray' : 'white'

  return (
    <LinkWrapper href='TODO' disabled>
      <View style={styles.container}>
        <View style={styles.segment1}>
          <View style={styles.dateSegment}>
            <View style={styles.time}>
              <Text color='silver'>{formatDateStringToShortTime(date)}</Text>
            </View>
          </View>

          <View style={styles.border} />

          <View style={styles.teams}>
            <Text
              variant={getTeamFontVariant(homeTeam.name)}
              numberOfLines={1}
              color={fontColorHome}
            >
              {homeTeam.name}
            </Text>

            <Text
              variant={getTeamFontVariant(awayTeam.name)}
              numberOfLines={1}
              color={fontColorAway}
            >
              {awayTeam.name}
            </Text>
          </View>
        </View>

        <View style={styles.segment2}>
          {/*    {isLive && (
        <View style={styles.liveResult}>
          <Text color='red' variant='xs' fontWeight='500'>
            {status === FixtureStatus.HALF_TIME ? 'HT' : `${liveResult?.elapsed}'`}
          </Text>
        </View>
      )} */}

          {isPostponed && (
            <View style={styles.status}>
              <Text color='gray' variant='xs' fontWeight='500'>
                {t('fixture.postponed')}
              </Text>
            </View>
          )}

          {gameFinished && (
            <View style={styles.result}>
              <Text color={fontColorHome} variant='md'>
                {homeTeamGoalsIndicator}
              </Text>
              <Text color={fontColorAway} variant='md'>
                {awayTeamGoalsIndicator}
              </Text>
            </View>
          )}

          {customRightComponent && (
            <>
              {gameFinished && <View style={styles.border} />}

              {customRightComponent}
            </>
          )}

          {!customRightComponent && (
            <>
              {gameFinished && <View style={styles.border} />}

              <View style={styles.icon}>
                <TouchableOpacity>
                  <Feather name='info' size={24} color={Colors.infoButton} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </LinkWrapper>
  )
}

const getTeamFontVariant = (text: string) => (text.length > 20 ? 'sm' : 'lg')

const getFixtureDetails = (fixture: Fixture) => {
  const { homeTeamId, awayTeamId } = fixture

  const finishedExtra =
    (!!fixture.homeTeamGoalsExtra || !!fixture.awayTeamGoalsExtra) &&
    fixture.homeTeamGoalsExtra !== fixture.awayTeamGoalsExtra

  const finishedPenalty = !!fixture.homeTeamGoalsPenalty || !!fixture.awayTeamGoalsPenalty

  const homeTeamGoals = fixture.homeTeamGoalsFinish || 0
  const awayTeamGoals = fixture.awayTeamGoalsFinish || 0
  const teamIdWon = fixture.teamIdWon

  const homeTeamGoalsIndicator =
    finishedExtra && teamIdWon === homeTeamId
      ? `${homeTeamGoals}et`
      : finishedPenalty && teamIdWon === homeTeamId
        ? `${homeTeamGoals}pn`
        : homeTeamGoals

  const awayTeamGoalsIndicator =
    finishedExtra && teamIdWon === awayTeamId
      ? `${awayTeamGoals}et`
      : finishedPenalty && teamIdWon === awayTeamId
        ? `${awayTeamGoals}pn`
        : awayTeamGoals

  const extraOrPenalty = finishedExtra || finishedPenalty
  const gameFinished = FIXTURE_STATUS.finished.includes(fixture.status as FixtureStatus)
  const isPostponed = fixture.status === FixtureStatus.POSTPONED
  const isLive = false //TODO

  const isHomeWinner = fixture.homeTeamGoalsFinish! > fixture.awayTeamGoalsFinish!
  const isAwayWinner = fixture.awayTeamGoalsFinish! > fixture.homeTeamGoalsFinish!
  const isDraw = !extraOrPenalty && isHomeWinner === isAwayWinner

  return {
    homeTeamGoalsIndicator,
    awayTeamGoalsIndicator,
    gameFinished,
    isPostponed,
    isLive,
    isHomeWinner,
    isAwayWinner,
    isDraw,
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 4,
  },
  segment1: { flexDirection: 'row', gap: 12 },
  segment2: {
    flexDirection: 'row',
    gap: 16,
  },
  dateSegment: {
    width: Dimensions.get('window').width / 8.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveResult: { justifyContent: 'center' },
  status: { justifyContent: 'center' },
  date: { justifyContent: 'center', alignItems: 'center' },
  time: {
    justifyContent: 'center',
  },
  border: { borderRightWidth: 1, borderRightColor: 'gray' },
  teams: {
    flexDirection: 'column',
  },
  result: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  icon: { justifyContent: 'center' },
  customBottomComponent: {
    marginTop: 10,
  },
})
