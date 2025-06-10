import { Bet, InsertBet, UpdateBet } from '@f-stats-bets/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useFetch } from '../fetch'

const baseUrl = '/bets'

export const useCreateBet = () => {
  const { handleFetch } = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: InsertBet) =>
      handleFetch<Bet>(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
    },
  })
}

export const useUpdateBet = () => {
  const { handleFetch } = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBet) =>
      handleFetch<Bet>(`${baseUrl}/${data.betId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { betId }) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', betId] })
    },
  })
}

export const useDeleteBet = () => {
  const { handleFetch } = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (betId: string) =>
      handleFetch<Bet>(`${baseUrl}/${betId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', id] })
    },
  })
}
