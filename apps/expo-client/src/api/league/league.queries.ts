import { League } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useLeagues = () => {
  const { handleFetch } = useFetch()

  return useQuery<League[]>({
    queryKey: ['leagues'],
    queryFn: () =>
      handleFetch('/leagues', {
        method: 'GET',
      }),
    throwOnError: true,
  })
}
