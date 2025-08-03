import { ReactNode, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'

import { Colors } from '../colors'

type ScreenWrapperProps = {
  children: ReactNode | ((props: { scrollOffsetY: Animated.Value }) => ReactNode)
}

export const ScreenWrapper = ({ children }: ScreenWrapperProps) => {
  const scrollOffsetY = useRef(new Animated.Value(0)).current

  return (
    <View style={styles.container}>
      {typeof children === 'function' ? children({ scrollOffsetY }) : children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.listContainer,
  },
})
