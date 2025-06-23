import { BetCompetition, CreateBetCompetitionSchema } from '@f-stats-bets/types'
import { useMutation } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useCreateBetCompetition = () => {
  const { handleFetch } = useFetch()

  return useMutation({
    mutationFn: (data: CreateBetCompetitionSchema) =>
      handleFetch<BetCompetition>(`/bet-competitions`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}
