import { PropsWithChildren, useRef } from 'react'
import { RefreshControl, ScrollView, StyleSheet } from 'react-native'

import { APP_PADDING_HORIZONTAL } from '../styles'

import { RefetchFunction, useManualRefresh } from '@/hooks/useManualRefresh'
import { OnScrollProps } from '@/lib/types'
import { useRegisterScrollToTop } from '@/providers/ScrollProvider'

interface Props extends PropsWithChildren, OnScrollProps {
  refetch?: RefetchFunction
}

export const ScrollViewWrapper = ({ children, refetch, onScroll }: Props) => {
  const { refreshIndicator, handleManualRefresh } = useManualRefresh(refetch)

  const scrollViewRef = useRef<ScrollView>(null)

  useRegisterScrollToTop(scrollViewRef)

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={onScroll}
      keyboardDismissMode='on-drag'
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        refetch && <RefreshControl refreshing={refreshIndicator} onRefresh={handleManualRefresh} />
      }
    >
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerText: {
    paddingVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: APP_PADDING_HORIZONTAL,
    paddingBottom: 80,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
})
