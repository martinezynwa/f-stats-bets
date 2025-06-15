import { useEffect, useState } from 'react'

import { useGlobalBetCompetitionId } from '@/api/bet-competition/bet-competition.queries'
import { useBets } from '@/api/bet/bet.queries'
import { useLeagues } from '@/api/league/league.queries'
import { useSeasons } from '@/api/season/season.queries'
import { useCatalogStore, useUserDataStore } from '@/store'

export const usePreloadAppData = (enabled: boolean) => {
  const [initialLoaded, setInitialLoaded] = useState(false)
  const { setCatalogData } = useCatalogStore()
  const { user } = useUserDataStore()

  const { isFetched: globalBetCompetitionIdFetched, error: globalBetCompetitionIdError } =
    useGlobalBetCompetitionId()

  const {
    data: seasonData,
    isFetched: seasonsFetched,
    error: seasonsError,
  } = useSeasons({
    supported: true,
    enabled,
  })

  const { data: leagueData, isFetched: leaguesFetched, error: leaguesError } = useLeagues(enabled)

  const { isFetched: betsFetched, error: betsError } = useBets({
    userId: user?.id!,
    enabled,
  })

  const isFetched = leaguesFetched && seasonsFetched && globalBetCompetitionIdFetched && betsFetched
  const error = leaguesError || seasonsError || globalBetCompetitionIdError || betsError

  useEffect(() => {
    if (isFetched && !initialLoaded) {
      setCatalogData({
        seasons: seasonData
          ? Object.fromEntries(seasonData.map(season => [season.seasonId, season]))
          : {},
        leagues: leagueData
          ? Object.fromEntries(leagueData.map(league => [league.id, league]))
          : {},
      })
      setInitialLoaded(true)
    }
  }, [isFetched, initialLoaded, setCatalogData, seasonData, leagueData])

  return { error, initialLoaded }
}
