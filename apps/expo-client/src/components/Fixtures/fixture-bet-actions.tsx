import { BetResultType, FixtureWithBet } from '@f-stats-bets/types'

import { BetResultActionButtons } from '../Bets'

interface Props {
  fixture: FixtureWithBet
}

export const FixtureBetActions = ({ fixture }: Props) => {
  const { Bet } = fixture

  const onAction = (value: BetResultType) => {
    console.log(value)
  }

  const checkIsButtonActive = (actualBet: BetResultType) => {
    return Bet?.fixtureResultBet === actualBet
  }

  return <BetResultActionButtons onAction={onAction} checkIsButtonActive={checkIsButtonActive} />
}
