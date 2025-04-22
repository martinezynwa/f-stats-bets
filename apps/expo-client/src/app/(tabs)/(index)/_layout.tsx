import { Text, View } from 'react-native'

import { useTranslation } from '@/i18n/useTranslation'
import { Colors, HeaderLayout } from '@/ui'

const HomeLayout = () => {
  const { t } = useTranslation()

  return (
    <HeaderLayout
      name='index'
      headerTitle={t('home.home')}
      headerComponent={
        <View
          style={{
            backgroundColor: Colors.headerBackground,
            height: 90,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>{t('home.home')}</Text>
        </View>
      }
    />
  )
}

export default HomeLayout
