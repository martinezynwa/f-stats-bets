import { BetWithFixture, GetBetsResponse } from '@f-stats-bets/types'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'
import { PaginatedResponse } from '../types'

export const useBets = (input: { userId: string; enabled?: boolean }) => {
  const { handleFetch, createQueryString } = useFetch()

  return useInfiniteQuery<
    GetBetsResponse,
    Error,
    PaginatedResponse<BetWithFixture>,
    string[],
    string | undefined
  >({
    queryKey: ['bets', input.userId],
    queryFn: async ({ pageParam }) => {
      const queryString = createQueryString({
        cursor: pageParam,
        userId: input.userId,
      })

      const response = await handleFetch<GetBetsResponse>(`/bets?${queryString}`)

      return response
    },
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: input.enabled,
  })
}
