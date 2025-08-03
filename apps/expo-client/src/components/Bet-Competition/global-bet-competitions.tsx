import { BetCompetitionList } from './bet-competition-list'

import { useBetCompetitions } from '@/api'

export const GlobalBetCompetitions = () => {
  const { data: betCompetitions, isLoading, isError } = useBetCompetitions({ isGlobal: true })

  if (isLoading) return null
  if (isError) return null
  if (!betCompetitions || betCompetitions.length === 0) return null

  return <BetCompetitionList betCompetitions={betCompetitions} />
}
