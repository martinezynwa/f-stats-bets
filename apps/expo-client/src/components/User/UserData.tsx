import { Text, TouchableOpacity, View } from 'react-native'

import { useLoginLogout } from '../Auth/useLoginLogout'

import { useTranslation } from '@/i18n/useTranslation'
import { useAuth } from '@/providers/AuthProvider'
import { ScrollViewWrapper } from '@/ui'

export const UserData = () => {
  const { session, setSession } = useAuth()
  const { changeLanguage, language, t } = useTranslation()

  const { handleSignOut } = useLoginLogout()

  const onSignOut = async () => {
    handleSignOut()
    setSession(null)
  }

  return (
    <ScrollViewWrapper>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          padding: 10,
        }}
      >
        <Text style={{ color: 'white' }}>{session?.user?.email}</Text>
        <TouchableOpacity
          style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}
          onPress={() => changeLanguage(language === 'cs' ? 'en' : 'cs')}
        >
          <Text>{t('profile.changeLanguage')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: 'white', padding: 10, borderRadius: 5 }}
          onPress={onSignOut}
        >
          <Text>{t('profile.signOut')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollViewWrapper>
  )
}
