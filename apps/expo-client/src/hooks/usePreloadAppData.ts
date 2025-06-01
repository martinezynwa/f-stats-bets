import { useEffect, useState } from 'react'

import { useFixturesWithBets } from '@/api'
import { useLeagues } from '@/api/league/league.queries'
import { useSeasons } from '@/api/season/season.queries'
import { getCurrentDate } from '@/lib/util/date-and-time'

export const usePreloadAppData = (enabled: boolean) => {
  const [initialLoaded, setInitialLoaded] = useState(false)

  const { isFetched: seasonsFetched, error: seasonsError } = useSeasons({
    supported: true,
    enabled,
  })

  const { isFetched: leaguesFetched, error: leaguesError } = useLeagues(enabled)

  const { isFetched: betsFetched, error: betsError } = useFixturesWithBets({
    input: { dateFrom: getCurrentDate(), dateTo: getCurrentDate() },
    enabled,
  })

  const isFetched = leaguesFetched && betsFetched && seasonsFetched
  const error = leaguesError || betsError || seasonsError

  useEffect(() => {
    if (isFetched && !initialLoaded) {
      setInitialLoaded(true)
    }
  }, [isFetched, initialLoaded])

  return { error, initialLoaded }
}
