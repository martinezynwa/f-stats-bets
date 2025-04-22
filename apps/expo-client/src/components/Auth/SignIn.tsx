import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Image, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'

import { useLoginLogout } from './useLoginLogout'

import { useTranslation } from '@/i18n/useTranslation'
import { ActionButton, Colors, SubmitButton } from '@/ui'

export const SignInScreenComponent = () => {
  const { t } = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { handleEmailSignIn } = useLoginLogout()

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
        placeholderTextColor='gray'
      />

      <Text style={styles.label}>{t('login.label.password')}</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={t('login.label.password.placeholder')}
        style={styles.input}
        secureTextEntry
        placeholderTextColor='gray'
      />

      <View style={styles.buttonContainer}>
        <SubmitButton
          title={t('login.button.signIn')}
          onPress={() => handleEmailSignIn(email, password)}
          align='left'
        />
        <ActionButton
          text={t('login.button.signUp')}
          onPress={() => router.push('/sign-up')}
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
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
    gap: 16,
  },
})
