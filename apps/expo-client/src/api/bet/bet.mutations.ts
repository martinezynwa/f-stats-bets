import { Bet, CreateBetSchema, UpdateBetSchema } from '@f-stats-bets/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useCreateBet = () => {
  const { handleFetch } = useFetch()
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
  const { handleFetch } = useFetch()
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
  const { handleFetch } = useFetch()
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
