import { Bet } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { handleFetch } from '../fetch'

export const useBets = () => {
  return useQuery<Bet[]>({
    queryKey: ['bets'],
    queryFn: () => handleFetch<Bet[]>('/bets'),
  })
}

export const useBet = (id: string) => {
  return useQuery<Bet>({
    queryKey: ['bets', id],
    queryFn: () => handleFetch<Bet>(`/bets/${id}`),
  })
}
