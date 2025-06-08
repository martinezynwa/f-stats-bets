import Feather from '@expo/vector-icons/Feather'
import { FixtureStatus, TeamDetail } from '@f-stats-bets/types'
import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Colors, Text } from '@/ui'

interface FixtureInfo {
  homeTeam: TeamDetail
  awayTeam: TeamDetail
  date: string
  dateFormat: 'date' | 'time'
  resultDetails: ResultDetails
  liveResult?: LiveResult
  onIconPress?: () => void
  onIconLongPress?: () => void
  isOnBetDetail?: boolean
  isOnUserBetList?: boolean
  customRightComponent?: React.ReactNode
}

export const FixtureInfo = ({
  homeTeam,
  awayTeam,
  date,
  dateFormat,
  resultDetails,
  onIconPress,
  onIconLongPress,
  isOnBetDetail,
  isOnUserBetList,
  customRightComponent,
  liveResult,
}: FixtureInfo) => {
  const { gameFinished, teamIdWon, finishedExtra, finishedPenalty, homeTeamGoals, awayTeamGoals } =
    resultDetails

  const { isLive, goals, status } = liveResult || {}

  const isPostponed = status === FixtureStatus.POSTPONED

  const homeWinner = homeTeamGoals > awayTeamGoals
  const awayWinner = awayTeamGoals > homeTeamGoals

  const homeTeamGoalsIndicator =
    finishedExtra && teamIdWon === homeTeam.id
      ? `${homeTeamGoals}et`
      : finishedPenalty && teamIdWon === homeTeam.id
        ? `${homeTeamGoals}pn`
        : homeTeamGoals

  const awayTeamGoalsIndicator =
    finishedExtra && teamIdWon === awayTeam.id
      ? `${awayTeamGoals}et`
      : finishedPenalty && teamIdWon === awayTeam.id
        ? `${awayTeamGoals}pn`
        : awayTeamGoals

  const fontColorHome = gameFinished && awayWinner ? 'gray' : 'white'
  const fontColorAway = gameFinished && homeWinner ? 'gray' : 'white'

  return (
    <View style={styles.container}>
      <View style={styles.segment1}>
        <View style={styles.dateSegment}>
          {dateFormat === 'date' ? (
            <View style={styles.date}>
              <Text variant='sm' color='silver'>
                {formatDateToDDMM(date)}
              </Text>
              <Text variant='sm' color='silver'>
                {formatDateStringToShortTime(date)}
              </Text>
            </View>
          ) : (
            <View style={styles.time}>
              <Text color='silver'>{formatDateStringToShortTime(date)}</Text>
            </View>
          )}
        </View>
        <View style={styles.border} />
        <View style={styles.teams}>
          <Text variant={getTeamFontVariant(homeTeam.name)} numberOfLines={1} color={fontColorHome}>
            {homeTeam.name}
          </Text>
          <Text variant={getTeamFontVariant(awayTeam.name)} numberOfLines={1} color={fontColorAway}>
            {awayTeam.name}
          </Text>
        </View>
      </View>

      <View style={styles.segment2}>
        {isLive && (
          <View style={styles.liveResult}>
            <Text color='red' variant='xs' fontWeight='500'>
              {status === FixtureStatus.HALF_TIME ? 'HT' : `${liveResult?.elapsed}'`}
            </Text>
          </View>
        )}

        {isPostponed && (
          <View style={styles.status}>
            <Text color='gray' variant='xs' fontWeight='500'>
              PST
            </Text>
          </View>
        )}

        {(gameFinished || isLive) && (
          <View style={styles.result}>
            <Text color={fontColorHome} variant='md'>
              {isLive ? goals?.home : homeTeamGoalsIndicator}
            </Text>
            <Text color={fontColorAway} variant='md'>
              {isLive ? goals?.away : awayTeamGoalsIndicator}
            </Text>
          </View>
        )}

        {customRightComponent && (
          <>
            <View style={styles.border} />
            {customRightComponent}
          </>
        )}

        {!customRightComponent && (
          <>
            <View style={styles.border} />
            <View style={styles.icon}>
              <TouchableOpacity onPress={onIconPress} onLongPress={onIconLongPress}>
                <Feather name='info' size={24} color={Colors.infoButton} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  )
}

const getTeamFontVariant = (text: string) => (text.length > 20 ? 'sm' : 'lg')

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
})
