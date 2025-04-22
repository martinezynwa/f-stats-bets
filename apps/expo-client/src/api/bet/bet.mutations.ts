import { Bet, CreateBetSchema, UpdateBetSchema } from '@f-stats-bets/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { handleFetch } from '../fetch'

export const useCreateBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateBetSchema) =>
      handleFetch<Bet>('/bets', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
    },
  })
}

export const useUpdateBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBetSchema) =>
      handleFetch<Bet>(`/bets/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', id] })
    },
  })
}

export const useDeleteBet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      handleFetch<Bet>(`/bets/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['bets'] })
      queryClient.invalidateQueries({ queryKey: ['bets', id] })
    },
  })
}
