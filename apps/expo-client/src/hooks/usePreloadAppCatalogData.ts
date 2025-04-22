import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { useUser } from '@/api'
import { useUserDataStore } from '@/store'

export const usePreloadAppCatalogData = () => {
  const router = useRouter()

  const { setUserData } = useUserDataStore()
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { data: user, error: userError } = useUser()

  useEffect(() => {
    if (!initialLoaded && user) {
      setUserData(user)

      setInitialLoaded(true)
    }
  }, [initialLoaded, user, setUserData, router])

  const error = userError

  return { error, initialLoaded }
}
