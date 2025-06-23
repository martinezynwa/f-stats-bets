import Entypo from '@expo/vector-icons/Entypo'
import { Pressable, StyleSheet, View } from 'react-native'

import { useNavigate } from '@/hooks/useNavigate'
import { useTranslation } from '@/i18n/useTranslation'
import { APP_PADDING_TOP, Colors, ScrollViewWrapper, Text } from '@/ui'

export const BetCompetitionsContainer = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const items = [
    {
      id: 1,
      title: t('bets.betCompetitions.global.title'),
      description: t('bets.betCompetitions.global.description'),
      icon: 'globe' as const,
      link: '/bet-competition/global',
    },
    {
      id: 2,
      title: t('bets.betCompetitions.userCompetitions.title'),
      description: t('bets.betCompetitions.userCompetitions.description'),
      icon: 'trophy' as const,
      link: '/bet-competition/joined',
    },
    {
      id: 3,
      title: t('bets.betCompetitions.userCreatedCompetitions.title'),
      description: t('bets.betCompetitions.userCreatedCompetitions.description'),
      icon: 'user' as const,
      link: '/bet-competition/user-created',
    },
    {
      id: 4,
      title: t('bets.betCompetitions.createCompetition.title'),
      description: t('bets.betCompetitions.createCompetition.description'),
      icon: 'circle-with-plus' as const,
      link: '/bet-competition/create',
    },
  ]

  return (
    <ScrollViewWrapper>
      <View style={styles.container}>
        {items.map(item => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.box, pressed && styles.boxPressed]}
            onPress={() => navigate(item.link)}
          >
            <View style={styles.boxContent}>
              <View style={styles.textContainer}>
                <View style={styles.titleContainer}>
                  <Entypo name={item.icon} size={24} color={Colors.text} style={styles.titleIcon} />
                  <Text variant='lg' fontWeight={600}>
                    {item.title}
                  </Text>
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.description} variant='md'>
                    {item.description}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Entypo name='chevron-right' size={32} color={Colors.text} style={styles.arrow} />
            </View>
          </Pressable>
        ))}
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
