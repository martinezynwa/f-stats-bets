import { create } from 'zustand'

type UserDetails = {
  username: string
}

type UserDataState = {
  user: UserDetails
  setUserData: (data: Partial<UserDataState>) => void
}

export const useUserDataStore = create<UserDataState>(set => ({
  user: {
    username: '',
  },
  setUserData: data => set(state => ({ ...state, ...data })),
}))
