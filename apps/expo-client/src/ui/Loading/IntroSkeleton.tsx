import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, View } from 'react-native'

export const IntroSkeleton = () => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate())
    }

    animate()

    return () => {
      scaleAnim.stopAnimation()
    }
  }, [scaleAnim])

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/icon.png')}
        style={[
          styles.icon,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
})
