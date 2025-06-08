import { FixturesList } from '../fixtures-list'

import { useBets, useFixtures } from '@/api'
import { useUserDataStore } from '@/store'
import { ScrollViewWrapper } from '@/ui'
import { useDatePickerStore } from '@/ui/Components/HorizontalDatePicker'

export const FixturesBetsContainer = () => {
  const { user } = useUserDataStore()
  const { datePickerDate } = useDatePickerStore()

  const queryParams = { dateFrom: datePickerDate, dateTo: datePickerDate }

  const {
    data: fixturesData,
    isLoading: fixturesLoading,
    refetch: fixturesRefetch,
  } = useFixtures(queryParams)

  const {
    data: betsData,
    isLoading: betsLoading,
    refetch: betsRefetch,
  } = useBets({ userId: user!.id, ...queryParams })

  if (!fixturesData) {
    return <></>
  }

  if (fixturesLoading || betsLoading) {
    return <></>
  }

  const handleRefresh = () => {
    fixturesRefetch()
    betsRefetch()
  }

  return (
    <ScrollViewWrapper refetch={handleRefresh}>
      <FixturesList fixtures={fixturesData} />
    </ScrollViewWrapper>
  )
}
