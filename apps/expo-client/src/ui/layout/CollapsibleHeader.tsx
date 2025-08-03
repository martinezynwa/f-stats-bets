import { ReactNode } from 'react'
import { Animated, StyleSheet } from 'react-native'

import { baseColors, Colors } from '../colors'

import { HeaderBack } from './HeaderBack'

interface CollapsibleHeaderProps {
  title: string
  scrollOffsetY: Animated.Value
  paddingTop?: number
  headerRightIcon?: ReactNode
  showBackButton?: boolean
}

const MAX_HEIGHT = 130
const MIN_HEIGHT = 100
const scrollDistance = MAX_HEIGHT - MIN_HEIGHT

const getInitialFontSize = (title: string) => {
  const length = title.length
  if (length < 10) return 36
  if (length < 15) return 32
  if (length < 25) return 28
  if (length < 30) return 24
  if (length < 35) return 22
  return 20
}

export const CollapsibleHeader = ({
  title,
  scrollOffsetY,
  paddingTop = 60,
  headerRightIcon,
  showBackButton,
}: CollapsibleHeaderProps) => {
  const initialFontSize = getInitialFontSize(title)

  const animatedHeaderHeight = scrollOffsetY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [MAX_HEIGHT, MIN_HEIGHT],
    extrapolate: 'clamp',
  })

  const animatedFontSize = scrollOffsetY.interpolate({
    inputRange: [0, scrollDistance],
    outputRange: [initialFontSize, 20],
    extrapolate: 'clamp',
  })

  return (
    <Animated.View style={[styles.headerContainer, { height: animatedHeaderHeight, paddingTop }]}>
      {showBackButton && <HeaderBack />}
      <Animated.Text style={[styles.title, { fontSize: animatedFontSize }]} numberOfLines={1}>
        {title}
      </Animated.Text>
      <Animated.View style={styles.headerRightIcon}>{headerRightIcon}</Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: Colors.headerBackground,
  },
  title: {
    color: baseColors.white,
    fontWeight: '600',
  },
  headerRightIcon: {
    alignSelf: 'center',
  },
})
