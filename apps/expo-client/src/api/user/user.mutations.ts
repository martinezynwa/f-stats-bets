import { RegisterUserInput, RegisterUserResponse } from '@f-stats-bets/types'
import { useMutation } from '@tanstack/react-query'

import { useFetch } from '../fetch'

export const useRegisterUser = () => {
  const { handleFetch } = useFetch()

  return useMutation({
    mutationFn: (data: RegisterUserInput) =>
      handleFetch<RegisterUserResponse>(`/users/register-user`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}
