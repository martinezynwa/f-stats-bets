import {
  FixtureWithTeamDetails,
  FixturesBetsSchema,
  FixturesSchema,
  FixturesWithBets,
} from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useFixturesWithBets = ({
  input,
  enabled,
}: {
  input: FixturesBetsSchema
  enabled?: boolean
}) => {
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

export const useFixtures = (input: FixturesSchema) => {
  const { handleFetch } = useFetch()

  return useQuery<FixtureWithTeamDetails[]>({
    queryKey: ['fixtures', input],
    queryFn: () =>
      handleFetch(`/fixtures`, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    throwOnError: true,
  })
}
