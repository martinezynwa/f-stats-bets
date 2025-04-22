import { PropsWithChildren } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'

import { HeaderTitle } from '../Layout'

import { SafeAreaWrapper } from './SafeAreaWrapper'

import { RefetchFunction, useManualRefresh } from '@/hooks/useManualRefresh'

interface Props extends PropsWithChildren {
  headerText?: string
  refetch?: RefetchFunction
}

export const ScrollViewWrapper = ({ children, headerText, refetch }: Props) => {
  const { refreshIndicator, handleManualRefresh } = useManualRefresh(refetch)

  return (
    <SafeAreaWrapper>
      {headerText && (
        <View style={styles.headerText}>
          <HeaderTitle />
        </View>
      )}

      <ScrollView
        keyboardDismissMode='on-drag'
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          refetch && (
            <RefreshControl refreshing={refreshIndicator} onRefresh={handleManualRefresh} />
          )
        }
      >
        {children}
      </ScrollView>
    </SafeAreaWrapper>
  )
}

const styles = StyleSheet.create({
  headerText: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingBottom: 80,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
})
