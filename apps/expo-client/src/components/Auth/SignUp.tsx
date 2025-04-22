import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'

import { useRegisterUser } from '@/api/user/user.mutations'
import { useToast } from '@/hooks/useToast'
import { useTranslation } from '@/i18n/useTranslation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/providers/AuthProvider'
import { ActionButton, Colors, SubmitButton } from '@/ui'

export const SignUpScreenComponent = () => {
  const { t } = useTranslation()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const { mutateAsync: registerUser } = useRegisterUser()
  const { setSession } = useAuth()

  const signUpWithEmail = async () => {
    if (!email || !password || !username) {
      Alert.alert(t('login.signUp.error'))
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
    }

    if (data.user?.id) {
      const response = await registerUser({
        providerId: data.user.id,
        providerName: email,
        providerAvatar: data.user.user_metadata.avatar_url || '',
        name: username,
      })

      toast({
        title: response.text,
      })

      setSession(data.session)
    }
  }

  return (
    <View style={styles.container} onTouchStart={() => Keyboard.dismiss()}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
          resizeMode='contain'
        />
      </View>

      <Text style={styles.label}>{t('login.label.email')}</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={t('login.label.email.placeholder')}
        style={styles.input}
      />

      <Text style={styles.label}>{t('login.label.password')}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={t('login.label.password.placeholder')}
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>{t('login.label.username')}</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder={t('login.label.username.placeholder')}
        style={styles.input}
      />

      <View style={styles.buttonContainer}>
        <SubmitButton
          title={t('login.button.createAccount')}
          onPress={() => signUpWithEmail()}
          align='left'
        />
        <ActionButton
          text={t('login.button.signIn')}
          onPress={() => router.push('/sign-in')}
          iconRight={<Ionicons name='arrow-forward' size={24} color='white' />}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
    backgroundColor: Colors.loginBackground,
  },
  label: {
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 10,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    gap: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
  },
})
