import type { QueryObserverResult } from '@tanstack/react-query'
import { useState } from 'react'

export type RefetchFunction =
  | (() => Promise<QueryObserverResult<unknown, unknown>>)
  | (() => void)
  | (() => Promise<void>)

export const useManualRefresh = (refetch?: RefetchFunction) => {
  const [refreshIndicator, setRefreshIndicator] = useState(false)

  const handleManualRefresh = async () => {
    setRefreshIndicator(true)

    try {
      await refetch?.()
      setRefreshIndicator(false)
    } catch {
      setRefreshIndicator(false)
    }
  }

  return { refreshIndicator, handleManualRefresh }
}
