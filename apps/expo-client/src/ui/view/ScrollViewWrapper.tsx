import { PropsWithChildren, useEffect, useRef } from 'react'
import { RefreshControl, ScrollView, StyleSheet } from 'react-native'

import { APP_PADDING_HORIZONTAL } from '../styles'

import { RefetchFunction, useManualRefresh } from '@/hooks/useManualRefresh'
import { scrollToTopEmitter } from '@/hooks/useScrollToTop'
import { OnScrollProps } from '@/lib/types'

interface Props extends PropsWithChildren, OnScrollProps {
  refetch?: RefetchFunction
}

export const ScrollViewWrapper = ({ children, refetch, onScroll }: Props) => {
  const { refreshIndicator, handleManualRefresh } = useManualRefresh(refetch)

  const scrollViewRef = useRef<ScrollView>(null)

  useEffect(() => {
    const handleScrollToTop = () => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true })
    }

    scrollToTopEmitter?.on?.('scrollToTop', handleScrollToTop)

    return () => {
      scrollToTopEmitter?.off?.('scrollToTop', handleScrollToTop)
    }
  }, [])

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
