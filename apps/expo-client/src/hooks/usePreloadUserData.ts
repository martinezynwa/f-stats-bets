import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { useUser, useUserSettings } from '@/api'
import { useUserDataStore } from '@/store'

export const usePreloadUserData = (enabled: boolean) => {
  const router = useRouter()

  const { setUserData } = useUserDataStore()
  const [initialLoaded, setInitialLoaded] = useState(false)
  const [userNotFound, setUserNotFound] = useState(false)

  const { data: user, error: userError, isFetched: userQueryFetched } = useUser(enabled)
  const { data: userSettings } = useUserSettings(!!user)

  useEffect(() => {
    if (!initialLoaded && user) {
      setInitialLoaded(true)
      setUserData(user)
    }

    if (userQueryFetched && !user) {
      setInitialLoaded(true)
      setUserNotFound(true)
    }
  }, [initialLoaded, user, userSettings, setUserData, router, userQueryFetched])

  const error = userError

  return { error, initialLoaded, userNotFound }
}
