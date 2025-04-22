import { Bet } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useBets = () => {
  const { handleFetch } = useFetch()

  return useQuery<Bet[]>({
    queryKey: ['bets'],
    queryFn: () => handleFetch<Bet[]>('/bets'),
  })
}

export const useBet = (id: string) => {
  const { handleFetch } = useFetch()

  return useQuery<Bet>({
    queryKey: ['bets', id],
    queryFn: () => handleFetch<Bet>(`/bets/${id}`),
  })
}
