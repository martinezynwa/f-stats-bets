import { FontAwesome5 } from '@expo/vector-icons'
import { BetCompetitionWithLeagues } from '@f-stats-bets/types'
import { format } from 'date-fns'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useNavigate } from '@/hooks/useNavigate'
import { Colors, ScrollViewWrapper, Text } from '@/ui'

interface Props {
  betCompetitions: BetCompetitionWithLeagues[]
}

export const BetCompetitionList = ({ betCompetitions }: Props) => {
  const navigate = useNavigate()

  return (
    <ScrollViewWrapper>
      {betCompetitions
        .sort((a, b) => new Date(a.dateStart).getTime() - new Date(b.dateStart).getTime())
        .map(betCompetition => {
          const { betCompetitionId, name, dateStart, dateEnd } = betCompetition

          return (
            <TouchableOpacity
              key={betCompetition.betCompetitionId}
              style={styles.competitionRow}
              onPress={() => navigate(`/bet-competition/${betCompetitionId}/id`)}
            >
              <View style={styles.rowContent}>
                <Text variant='lg' style={styles.title}>
                  {name}
                </Text>

                <Text variant='md' style={styles.date}>
                  {format(new Date(dateStart), 'd MMM yyyy')} -{' '}
                  {format(new Date(dateEnd), 'd MMM yyyy')}
                </Text>
              </View>
              <FontAwesome5 name='chevron-right' size={16} color={Colors.textFaded} />
            </TouchableOpacity>
          )
        })}
    </ScrollViewWrapper>
  )
}

const styles = StyleSheet.create({
  competitionRow: {
    backgroundColor: Colors.box,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContent: { flex: 1 },
  title: { marginBottom: 8 },
  date: { color: Colors.textFaded },
})
