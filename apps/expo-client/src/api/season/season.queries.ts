import { Season } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

interface UseSeasonsProps {
  supported?: boolean
  enabled?: boolean
}

export const useSeasons = ({ supported, enabled }: UseSeasonsProps) => {
  const { handleFetch } = useFetch()

  return useQuery<Season[]>({
    queryKey: ['seasons', supported],
    queryFn: () =>
      handleFetch(`/seasons/${supported ? 'supported' : ''}`, {
        method: 'GET',
      }),
    throwOnError: true,
    enabled,
    staleTime: Infinity,
  })
}
