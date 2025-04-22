import { Redirect, useNavigation } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

import { supabase } from '@/lib/supabase'

export const useLoginLogout = () => {
  const navigation = useNavigation()

  const [loading, setLoading] = useState(false)

  const handleSignOut = () => {
    supabase.auth.signOut()
    navigation.goBack()

    return <Redirect href='/(auth)/sign-in' />
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)

    setLoading(false)
  }

  return { handleSignOut, handleEmailSignIn, loading }
}
