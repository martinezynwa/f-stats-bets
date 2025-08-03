import { EventEmitter } from 'events'

import { FlashList } from '@shopify/flash-list'
import { useRef, useEffect } from 'react'

export const scrollToTopEmitter = new EventEmitter()

export const useScrollToTop = <T>() => {
  const listRef = useRef<FlashList<T>>(null)

  useEffect(() => {
    const handleScrollToTop = () => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true })
    }

    scrollToTopEmitter?.on?.('scrollToTop', handleScrollToTop)

    return () => {
      scrollToTopEmitter?.off?.('scrollToTop', handleScrollToTop)
    }
  }, [])

  return listRef
}
