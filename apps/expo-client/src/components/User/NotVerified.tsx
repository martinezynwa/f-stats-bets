import { useTranslation } from 'react-i18next'
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'

import { useLoginLogout } from '../Auth/useLoginLogout'

import { useAuth } from '@/providers/AuthProvider'
import { useUserDataStore } from '@/store'
import { Text } from '@/ui'

export const NotVerified = () => {
  const { t } = useTranslation()
  const { setSession } = useAuth()
  const { user, setUserData } = useUserDataStore()
  const { handleSignOut } = useLoginLogout()

  const onSignOut = async () => {
    setSession(null)
    setUserData(null)
    handleSignOut()
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={styles.text}>{t('login.notVerified.title')}</Text>
      <Text style={styles.text}>
        {t('login.notVerified.subtitle', { providerName: user?.providerName })}
      </Text>

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
