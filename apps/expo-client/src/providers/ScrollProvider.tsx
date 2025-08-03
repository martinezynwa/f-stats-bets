import { FlashList } from '@shopify/flash-list'
import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react'
import { ScrollView } from 'react-native'

type ListItemType = {
  id: string
  item?: ReactNode
}

export type ScrollRef = FlashList<ListItemType> | ScrollView | null

interface ScrollContextType {
  registerScrollable: (ref: RefObject<ScrollRef>) => void
  unregisterScrollable: (ref: RefObject<ScrollRef>) => void
  scrollToTop: () => void
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const scrollablesRef = useRef<Set<RefObject<ScrollRef>>>(new Set())

  const registerScrollable = useCallback((ref: RefObject<ScrollRef>) => {
    scrollablesRef.current.add(ref)
  }, [])

  const unregisterScrollable = useCallback((ref: RefObject<ScrollRef>) => {
    scrollablesRef.current.delete(ref)
  }, [])

  const scrollToTop = useCallback(() => {
    scrollablesRef.current.forEach(ref => {
      if (!ref.current) return

      if ('scrollToOffset' in ref.current) {
        ref.current.scrollToOffset?.({ offset: 0, animated: true })
      } else {
        ref.current.scrollTo?.({ y: 0, animated: true })
      }
    })
  }, [])

  return (
    <ScrollContext.Provider value={{ registerScrollable, unregisterScrollable, scrollToTop }}>
      {children}
    </ScrollContext.Provider>
  )
}

export const useScroll = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
}

export const useRegisterScrollToTop = (ref: RefObject<ScrollRef>) => {
  const { registerScrollable, unregisterScrollable } = useScroll()

  useEffect(() => {
    registerScrollable(ref)
    return () => unregisterScrollable(ref)
  }, [ref, registerScrollable, unregisterScrollable])
}
