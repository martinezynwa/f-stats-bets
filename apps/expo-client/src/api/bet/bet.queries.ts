import { Bet, UserBetsSchema } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useBets = (input: UserBetsSchema) => {
  const { handleFetch, createQueryString } = useFetch()

  const queryString = createQueryString(input)

  return useQuery<Bet[]>({
    queryKey: ['bets', queryString],
    queryFn: () => handleFetch<Bet[]>(`/bets?${queryString}`, { method: 'GET' }),
  })
}
