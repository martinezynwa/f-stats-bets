import { Bet, BetResultType, Fixture, InsertBet, UpdateBet } from '@f-stats-bets/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useFetch } from '@/api/fetch'
import { hasGameStarted } from '@/components/Fixtures/fixture.helpers'
import { useToast } from '@/hooks/useToast'
import { useTranslation } from '@/i18n/useTranslation'
import { useUserDataStore } from '@/store'

type BetAction = {
  betId?: string
  fixtureResultBet: BetResultType
}

interface HandleFixtureResultBetAction {
  fixtureDetail: Fixture
  existingBet?: Bet
  newBet: BetAction
}

interface UseBetActionsProps {
  betCompetitionId: string
}

export const useBetActions = ({ betCompetitionId }: UseBetActionsProps) => {
  const toast = useToast()
  const { t } = useTranslation()
  const { handleFetch } = useFetch()
  const queryClient = useQueryClient()
  const { user } = useUserDataStore()

  const handleInvalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['fixtures-with-bets'] })
  }

  const { mutateAsync: createBet, isPending: createBetPending } = useMutation<
    Bet,
    Error,
    InsertBet
  >({
    mutationFn: (data: InsertBet) =>
      handleFetch(`${baseUrl}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => handleInvalidateQueries(),
    onError: () => {
      //TODO display toast,
    },
  })

  const { mutateAsync: updateBet, isPending: updateBetPending } = useMutation<
    Bet,
    Error,
    UpdateBet
  >({
    mutationFn: (data: UpdateBet) =>
      handleFetch(`${baseUrl}/${data.betId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => handleInvalidateQueries(),
    onError: () => {
      //TODO display toast,
    },
  })

  const { mutateAsync: deleteBet, isPending: deleteBetPending } = useMutation({
    mutationFn: (betId: string) =>
      handleFetch<Bet>(`${baseUrl}/${betId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => handleInvalidateQueries(),
    onError: () => {
      //TODO display toast,
    },
  })

  const handleFixtureResultBetAction = async ({
    fixtureDetail,
    existingBet,
    newBet,
  }: HandleFixtureResultBetAction) => {
    if (hasGameStarted(fixtureDetail.date)) {
      return toast({
        title: t('bet.action.gameStarted'),
      })
    }

    if (!existingBet) {
      await createBet({
        betCompetitionId,
        userId: user?.id!,
        fixtureId: fixtureDetail.fixtureId,
        leagueId: fixtureDetail.leagueId,
        season: fixtureDetail.season,
        fixtureResultBet: newBet.fixtureResultBet,
      })

      return
    }

    const isIdenticalBet = existingBet.fixtureResultBet === newBet.fixtureResultBet
    if (isIdenticalBet) {
      await deleteBet(existingBet.betId)

      return
    }

    const betExists = existingBet.fixtureResultBet
    if (betExists) {
      await updateBet({
        betId: existingBet.betId,
        fixtureResultBet: newBet.fixtureResultBet,
      })

      return
    }
  }

  const isMutating = createBetPending || deleteBetPending || updateBetPending

  return {
    handleFixtureResultBetAction,
    isMutating,
  }
}
const baseUrl = '/bets'
