import Entypo from '@expo/vector-icons/Entypo'
import { Pressable, StyleSheet, View } from 'react-native'

import { useTranslation } from '@/i18n/useTranslation'
import { APP_PADDING_TOP, Colors, ScrollViewWrapper, Text } from '@/ui'

export const BetCompetitionsContainer = () => {
  const { t } = useTranslation()

  const renderBox = (
    title: string,
    description: string,
    iconName: keyof typeof Entypo.glyphMap,
  ) => {
    return (
      <Pressable style={({ pressed }) => [styles.box, pressed && styles.boxPressed]}>
        <View style={styles.boxContent}>
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <Entypo name={iconName} size={24} color={Colors.text} style={styles.titleIcon} />
              <Text variant='xl' fontWeight={600}>
                {title}
              </Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.description} variant='md'>
                {description}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <Entypo name='chevron-right' size={32} color={Colors.text} style={styles.arrow} />
        </View>
      </Pressable>
    )
  }

  const items = [
    {
      id: 1,
      title: t('bets.betCompetitions.global.title'),
      description: t('bets.betCompetitions.global.description'),
      icon: 'globe' as const,
      link: '',
    },
    {
      id: 2,
      title: t('bets.betCompetitions.userCompetitions.title'),
      description: t('bets.betCompetitions.userCompetitions.description'),
      icon: 'trophy' as const,
      link: '',
    },
    {
      id: 3,
      title: t('bets.betCompetitions.createCompetition.title'),
      description: t('bets.betCompetitions.createCompetition.description'),
      icon: 'circle-with-plus' as const,
      link: '',
    },
  ]

  return (
    <ScrollViewWrapper>
      <View style={styles.container}>
        {items.map(item => renderBox(item.title, item.description, item.icon))}
      </View>
    </ScrollViewWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: APP_PADDING_TOP,
    gap: 16,
  },
  box: {
    backgroundColor: Colors.box,
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  boxContent: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleIcon: {
    opacity: 0.9,
  },
  descriptionContainer: {
    marginTop: 10,
  },
  description: {
    opacity: 0.7,
    fontSize: 16,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 16,
  },
  arrow: {
    opacity: 0.9,
  },
})
