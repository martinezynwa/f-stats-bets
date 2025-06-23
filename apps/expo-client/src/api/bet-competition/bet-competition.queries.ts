import { BetCompetitionWithLeagues, GetBetCompetitionsSchema } from '@f-stats-bets/types'
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

export const useBetCompetitions = (input: GetBetCompetitionsSchema) => {
  const { handleFetch, createQueryString } = useFetch()

  const queryString = createQueryString(input)

  return useQuery<BetCompetitionWithLeagues[]>({
    queryKey: ['bet-competitions', queryString],
    queryFn: () =>
      handleFetch<BetCompetitionWithLeagues[]>(`${baseUrl}?${queryString}`, { method: 'GET' }),
  })
}

export const useJoinedBetCompetitions = () => {
  const { handleFetch } = useFetch()

  return useQuery<BetCompetitionWithLeagues[]>({
    queryKey: ['bet-competitions', 'joined'],
    queryFn: () => handleFetch<BetCompetitionWithLeagues[]>(`${baseUrl}/joined`, { method: 'GET' }),
  })
}

export const useBetCompetition = (id: string) => {
  const { handleFetch } = useFetch()

  return useQuery<BetCompetitionWithLeagues>({
    queryKey: ['bet-competition', id],
    queryFn: () => handleFetch<BetCompetitionWithLeagues>(`${baseUrl}/${id}`, { method: 'GET' }),
  })
}
