import { BetCompetitionList } from './bet-competition-list'

import { useBetCompetitions } from '@/api'
import { ScrollViewWrapper } from '@/ui'

export const UserCreatedBetCompetitions = () => {
  const { data: betCompetitions, isLoading, isError } = useBetCompetitions({ isGlobal: false })

  if (isLoading) return null
  if (isError) return null
  if (!betCompetitions || betCompetitions.length === 0) return null

  return (
    <ScrollViewWrapper>
      <BetCompetitionList betCompetitions={betCompetitions} />
    </ScrollViewWrapper>
  )
}
