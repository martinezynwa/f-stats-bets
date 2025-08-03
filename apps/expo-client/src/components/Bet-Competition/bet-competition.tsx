import { useLocalSearchParams } from 'expo-router'
import { StyleSheet, View } from 'react-native'

import { useBetCompetition } from '@/api'
import { useTranslation } from '@/i18n/useTranslation'
import { OnScrollProps } from '@/lib/types'
import { formatDateToFull } from '@/lib/util'
import { useCatalogStore } from '@/store'
import { Colors, ScrollViewWrapper, Text } from '@/ui'

export const BetCompetition = ({ onScroll }: OnScrollProps) => {
  const { t } = useTranslation()

  const { id } = useLocalSearchParams()
  const { data: betCompetition, isLoading, isError } = useBetCompetition(id as string)

  const { leagues } = useCatalogStore()

  if (isLoading) return null
  if (isError) return null
  if (!betCompetition) return null

  const {
    name,
    dateStart,
    dateEnd,
    season,
    isGlobal,
    private: isPrivate,
    hasFinished,
    playerLimit,
    fixtureResultPoints,
    resultGoalsPoints,
    resultGoalsHomePoints,
    resultGoalsAwayPoints,
    resultScorersPoints,
    competitionTopScorerPoints,
    competitionTopAssistPoints,
    competitionTopCleanSheetsPoints,
    competition1stTeamPoints,
    competition2ndTeamPoints,
    competition3rdTeamPoints,
    competition4thTeamPoints,
    leagueIds,
  } = betCompetition

  const badges = [
    { show: isGlobal, text: t('bets.betCompetition.label.global'), style: styles.badge },
    { show: isPrivate, text: t('bets.betCompetition.label.private'), style: styles.badge },
    { show: hasFinished, text: t('bets.betCompetition.label.finished'), style: styles.badge },
  ]

  const detailSection = [
    {
      label: t('bets.betCompetition.label.season'),
      value: season,
    },
    {
      label: t('bets.betCompetition.label.playerLimit'),
      value: playerLimit,
    },
    {
      label: t('bets.betCompetition.label.startDate'),
      value: formatDateToFull(new Date(dateStart)),
    },
    {
      label: t('bets.betCompetition.label.endDate'),
      value: formatDateToFull(new Date(dateEnd)),
    },
  ]

  const leagueSection = leagueIds
    .map(leagueId => ({
      label: leagues[leagueId]?.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const pointSections = [
    {
      title: t('bets.betCompetition.title.matchPoints'),
      points: [
        { label: t('bets.betCompetition.label.matchResult'), value: fixtureResultPoints || '-' },
        { label: t('bets.betCompetition.label.goalsTotal'), value: resultGoalsPoints || '-' },
        { label: t('bets.betCompetition.label.homeGoals'), value: resultGoalsHomePoints || '-' },
        { label: t('bets.betCompetition.label.awayGoals'), value: resultGoalsAwayPoints || '-' },
        { label: t('bets.betCompetition.label.scorers'), value: resultScorersPoints || '-' },
      ],
    },
    {
      title: t('bets.betCompetition.title.competitionStatsPoints'),
      points: [
        {
          label: t('bets.betCompetition.label.topScorer'),
          value: competitionTopScorerPoints || '-',
        },
        {
          label: t('bets.betCompetition.label.topAssist'),
          value: competitionTopAssistPoints || '-',
        },
        {
          label: t('bets.betCompetition.label.topCleanSheets'),
          value: competitionTopCleanSheetsPoints || '-',
        },
      ],
    },
    {
      title: t('bets.betCompetition.title.teamFinalStandingsPoints'),
      points: [
        { label: t('bets.betCompetition.label.1stPlace'), value: competition1stTeamPoints || '-' },
        { label: t('bets.betCompetition.label.2ndPlace'), value: competition2ndTeamPoints || '-' },
        { label: t('bets.betCompetition.label.3rdPlace'), value: competition3rdTeamPoints || '-' },
        { label: t('bets.betCompetition.label.4thPlace'), value: competition4thTeamPoints || '-' },
      ],
    },
  ]

  return (
    <ScrollViewWrapper onScroll={onScroll}>
      <View style={styles.header}>
        <Text variant='xl' style={styles.title}>
          {name}
        </Text>

        <View style={styles.badges}>
          {badges.map(
            badge =>
              badge.show && (
                <View key={badge.text} style={badge.style}>
                  <Text style={styles.badgeText}>{badge.text}</Text>
                </View>
              ),
          )}
        </View>
      </View>

      <Section title={t('bets.betCompetition.title.competitionDetails')} items={detailSection} />

      <Section title={t('bets.betCompetition.title.leagues')} items={leagueSection} />

      {pointSections.map(section => (
        <Section key={section.title} title={section.title} items={section.points} />
      ))}
    </ScrollViewWrapper>
  )
}

const Section = ({
  title,
  items,
}: {
  title: string
  items: { label: string; value?: string | number }[]
}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text variant='lg' style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.card}>
        {items.map(item => (
          <View key={item.label} style={styles.sectionRow}>
            <Text variant='md'>{item.label}</Text>

            {item.value !== undefined && <Text variant='md'>{item.value}</Text>}
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: Colors.submitButton,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.bottomSheetItemsContainer,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  sectionContainer: {
    paddingVertical: 8,
  },
  sectionTitle: {
    marginLeft: 2,
    marginBottom: 6,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
