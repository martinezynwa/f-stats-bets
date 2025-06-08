import { useEffect, useState } from 'react'

import { useGlobalBetCompetitionId } from '@/api/bet-competition/bet-competition.queries'
import { useLeagues } from '@/api/league/league.queries'
import { useSeasons } from '@/api/season/season.queries'
import { useCatalogStore } from '@/store'

export const usePreloadAppData = (enabled: boolean) => {
  const [initialLoaded, setInitialLoaded] = useState(false)
  const { setCatalogData } = useCatalogStore()

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

  const isFetched = leaguesFetched && seasonsFetched && globalBetCompetitionIdFetched
  const error = leaguesError || seasonsError || globalBetCompetitionIdError

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
