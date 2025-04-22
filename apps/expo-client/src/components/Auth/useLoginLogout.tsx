import { Redirect, useNavigation } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'

export const useLoginLogout = () => {
  const navigation = useNavigation()
  const { setSession } = useAuth()

  const [loading, setLoading] = useState(false)

  const handleSignOut = () => {
    supabase.auth.signOut()
    navigation.goBack()

    return <Redirect href='/(auth)/sign-in' />
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    setLoading(true)

    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)

    if (data.user?.id) {
      setSession(data.session)
    }

    setLoading(false)
  }

  return { handleSignOut, handleEmailSignIn, loading }
}
