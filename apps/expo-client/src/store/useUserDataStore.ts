import { User } from '@f-stats-bets/types'
import { create } from 'zustand'

type UserDataState = {
  user: User | null
  setUserData: (data: User | null) => void
}

export const useUserDataStore = create<UserDataState>(set => ({
  user: null,
  setUserData: data => set({ user: data }),
}))
