import { Redirect, Stack } from 'expo-router'

import { useAuth } from '@/providers/AuthProvider'

export default function AuthLayout() {
  const { session, authLoading } = useAuth()

  if (authLoading) {
    return null
  }

  if (session) {
    return <Redirect href='/(tabs)' />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
