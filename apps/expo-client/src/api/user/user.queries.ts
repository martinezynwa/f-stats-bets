import { User } from '@f-stats-bets/types'
import { useQuery } from '@tanstack/react-query'

import { handleFetch } from '../fetch'

import { useAuth } from '@/providers/AuthProvider'

export const useUser = () => {
  const { session } = useAuth()
  const userId = session?.user.id!

  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => handleFetch<User>(`/users/${userId}`),
    enabled: !!userId,
  })
}
