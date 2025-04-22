import { User } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { useFetch } from '../fetch'

import { useAuth } from '@/providers/AuthProvider'

export const useUser = () => {
  const { handleFetch } = useFetch()
  const { session } = useAuth()
  const userId = session?.user.id!

  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => handleFetch<User>(`/users/${userId}`),
    enabled: !!userId,
  })
}
