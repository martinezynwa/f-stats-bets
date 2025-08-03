import { FontAwesome5 } from '@expo/vector-icons'
import { StyleSheet, View } from 'react-native'

import { useTranslation } from '@/i18n/useTranslation'
import { Text } from '@/ui/Typography/Text'
import { Colors } from '@/ui/colors'

export const GlobalBetCompetitionsHeader = () => {
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <FontAwesome5 name='trophy' size={24} color={Colors.text} style={styles.icon} />
      <Text variant='xl' fontWeight='600'>
        {t('header.title.globalCompetitions')}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.headerBackground,
  },
  icon: {
    marginRight: 12,
  },
})
