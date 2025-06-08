import { League } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useLeagues = (enabled?: boolean) => {
  const { handleFetch } = useFetch()

  return useQuery<League[]>({
    queryKey: ['leagues'],
    queryFn: () =>
      handleFetch('/leagues', {
        method: 'GET',
      }),
    throwOnError: true,
    enabled,
    staleTime: Infinity,
  })
}
