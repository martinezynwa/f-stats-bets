import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'

import { useLoginLogout } from '../Auth/useLoginLogout'

import { useAuth } from '@/providers/AuthProvider'
import { Text } from '@/ui'

export const NotVerified = () => {
  const { t } = useTranslation()
  const { setSession } = useAuth()

  const { handleSignOut } = useLoginLogout()

  const onSignOut = async () => {
    handleSignOut()
    setSession(null)
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.text}>{t('login.notVerified.title')}</Text>

      <TouchableOpacity
        style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}
        onPress={onSignOut}
      >
        <Text color='black'>{t('profile.signOut')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  text: {
    paddingBottom: 10,
  },
})
