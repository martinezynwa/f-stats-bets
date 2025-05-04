import { FixturesBetsSchema, FixturesWithBets } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

interface UseFixturesWithBetsProps {
  input: FixturesBetsSchema
  enabled?: boolean
}

export const useFixturesWithBets = ({ input, enabled }: UseFixturesWithBetsProps) => {
  const { handleFetch, createQueryString } = useFetch()

  const queryString = createQueryString(input)

  return useQuery<FixturesWithBets>({
    queryKey: ['fixtures-with-bets', queryString],
    queryFn: () =>
      handleFetch(`/fixtures/fixtures-bets?${queryString}`, {
        method: 'GET',
      }),
    throwOnError: true,
    enabled,
  })
}
