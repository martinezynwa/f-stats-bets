import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { useUser, useUserSettings } from '@/api'
import { useUserDataStore } from '@/store'

export const usePreloadUserData = (enabled: boolean) => {
  const router = useRouter()

  const { setUserData } = useUserDataStore()
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { data: user, error: userError } = useUser(enabled)
  const { data: userSettings, error: userSettingsError } = useUserSettings(enabled)

  useEffect(() => {
    if (!initialLoaded && user && userSettings) {
      setUserData(user)
      setInitialLoaded(true)
    }
  }, [initialLoaded, user, userSettings, setUserData, router])

  const error = userError || userSettingsError

  return { error, initialLoaded }
}
