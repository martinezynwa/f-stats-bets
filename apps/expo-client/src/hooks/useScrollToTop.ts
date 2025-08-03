import { FlashList } from '@shopify/flash-list'
import { ReactNode, RefObject, useEffect } from 'react'
import { ScrollView } from 'react-native'

import { scrollToTopEmitter } from '@/lib/scrollToTop'

type ListItemType = {
  id: string
  item?: ReactNode
}

type RefObjectType = FlashList<ListItemType> | ScrollView | null

export const useScrollToTop = (ref: RefObject<RefObjectType>) => {
  useEffect(() => {
    const handleScrollToTop = () => {
      if (ref.current) {
        if ('scrollToOffset' in ref.current) {
          ref.current.scrollToOffset({ offset: 0, animated: true })
        } else {
          ref.current.scrollTo({ y: 0, animated: true })
        }
      }
    }

    scrollToTopEmitter.on?.('scrollToTop', handleScrollToTop)

    return () => {
      scrollToTopEmitter.off?.('scrollToTop', handleScrollToTop)
    }
  }, [ref])
}
