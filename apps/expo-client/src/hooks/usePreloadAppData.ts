import { useEffect, useState } from 'react'

import { useBets } from '@/api'

export const usePreloadAppData = () => {
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { isFetched: betsFetched, error: betsError } = useBets()

  useEffect(() => {
    if (betsFetched && !initialLoaded) {
      setInitialLoaded(true)
    }
  }, [betsFetched, initialLoaded])

  return { error: betsError, initialLoaded }
}
