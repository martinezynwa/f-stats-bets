import { BetWithFixture } from '@f-stats-bets/types'
import { StyleSheet, View } from 'react-native'

import { UserBetItem } from './user-bet-item'

import { useBets } from '@/api'
import { useUserDataStore } from '@/store'
import { Colors, InfiniteList } from '@/ui'

export const UserBetsContainer = () => {
  const { user } = useUserDataStore()
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useBets({
    userId: user?.id!,
  })

  const items =
    data?.pages?.flatMap(page =>
      page.items.map((bet: BetWithFixture) => ({
        id: bet.betId,
        item: <UserBetItem bet={bet} />,
      })),
    ) || []

  if (isLoading) return null
  if (items.length === 0) return null

  const onItemPress = () => {}

  return (
    <View style={styles.container}>
      <InfiniteList
        verticalSpace
        items={items}
        outerHeader='User Bets'
        onItemPress={onItemPress}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        isLoadingMore={isFetchingNextPage}
        isRefreshing={isFetchingNextPage}
        onRefresh={refetch}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.listContainer,
    flex: 1,
  },
})
