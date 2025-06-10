import { BetResultType, FixtureWithBet } from '@f-stats-bets/types'

import { BetResultActionButtons } from '../Bets'
import { useBetActions } from '../Bets/hooks/useBetActions'

import { useGlobalBetCompetitionId } from '@/api'
import { useDebounce } from '@/hooks/useDebounce'

interface Props {
  fixture: FixtureWithBet
  queryKey?: string[]
}

export const FixtureBetActions = ({ fixture }: Props) => {
  const { data: globalBetCompetitionId } = useGlobalBetCompetitionId()
  const { handleFixtureResultBetAction, isMutating } = useBetActions({
    betCompetitionId: globalBetCompetitionId!,
  })

  const onAction = (value: BetResultType) => {
    handleFixtureResultBetAction({
      fixtureDetail: fixture,
      existingBet: fixture.Bet,
      newBet: { fixtureResultBet: value },
    })
  }

  const checkIsButtonActive = (actualBet: BetResultType) =>
    fixture?.Bet?.fixtureResultBet === actualBet

  const { debouncedCallback: debouncedOnAction, isDebouncing } = useDebounce(onAction)

  return (
    <BetResultActionButtons
      onAction={debouncedOnAction}
      checkIsButtonActive={checkIsButtonActive}
      isLoading={isMutating || isDebouncing}
    />
  )
}
