import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

const baseUrl = '/bet-competitions'

export const useGlobalBetCompetitionId = () => {
  const { handleFetch } = useFetch()

  return useQuery<string>({
    queryKey: ['global'],
    queryFn: () => handleFetch<string>(`${baseUrl}/global`, { method: 'GET' }),
  })
}
