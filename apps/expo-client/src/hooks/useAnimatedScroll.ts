import { Animated } from 'react-native'

export const useAnimatedScroll = () => {
  const onScroll = (scrollOffsetY: Animated.Value) =>
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }], {
      useNativeDriver: false,
    })

  return { onScroll }
}
