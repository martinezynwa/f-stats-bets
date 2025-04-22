import { PropsWithChildren } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from '../colors'
import { APP_PADDING_HORIZONTAL } from '../styles'

export const SafeAreaWrapper = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: APP_PADDING_HORIZONTAL,
    backgroundColor: Colors.background,
  },
})
