import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { FlashList } from '@shopify/flash-list'
import { ReactNode, useRef, useState } from 'react'
import {
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'
import { APP_PADDING_HORIZONTAL, APP_PADDING_TOP, PAGE_BOTTOM_PADDING } from '../styles'

import { useRegisterScrollToTop } from '@/providers/ScrollProvider'

export type ListItemType = {
  id: string
  item?: ReactNode
}

interface ListProps {
  outerHeader?: string
  innerHeader?: string
  items: ListItemType[]
  onItemPress?: (id: string) => void
  onOuterHeaderPress?: () => void
  onInnerHeaderPress?: () => void
  onEndReached?: () => void
  isLoadingMore?: boolean
  onRefresh?: () => Promise<void> | void
  isRefreshing?: boolean
  verticalSpace?: boolean
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
  contentInsetTop?: number
}

export const InfiniteList = ({
  outerHeader,
  innerHeader,
  items,
  onItemPress,
  onOuterHeaderPress,
  onInnerHeaderPress,
  onEndReached,
  isLoadingMore,
  onRefresh,
  isRefreshing = false,
  verticalSpace,
  onScroll,
  contentInsetTop = 10,
}: ListProps) => {
  const listRef = useRef<FlashList<ListItemType>>(null)
  const [isManualRefresh, setIsManualRefresh] = useState(false)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScroll?.(event)
  }

  const handleEndReached = () => {
    onEndReached?.()
  }

  const handleRefresh = async () => {
    if (!onRefresh) return
    setIsManualRefresh(true)
    await onRefresh()
    setIsManualRefresh(false)
  }

  useRegisterScrollToTop(listRef)

  return (
    <FlashList
      ref={listRef}
      estimatedItemSize={50}
      data={items}
      keyExtractor={item => item.id}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='automatic'
      onScroll={handleScroll}
      scrollEventThrottle={5}
      contentContainerStyle={{
        paddingBottom: verticalSpace ? PAGE_BOTTOM_PADDING : 0,
        paddingTop: contentInsetTop || (verticalSpace ? APP_PADDING_TOP : 0),
        paddingHorizontal: APP_PADDING_HORIZONTAL,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={isManualRefresh && isRefreshing} onRefresh={handleRefresh} />
        ) : undefined
      }
      ListHeaderComponent={
        <View>
          {outerHeader && (
            <TouchableOpacity style={styles.outerHeader} onPress={onOuterHeaderPress}>
              <Text fontWeight={600} variant='xl'>
                {outerHeader}
              </Text>
            </TouchableOpacity>
          )}
          {innerHeader && (
            <TouchableOpacity style={styles.innerHeader} onPress={onInnerHeaderPress}>
              <Text color='gray' fontWeight={600}>
                {innerHeader}
              </Text>
              <FontAwesome5
                name='chevron-right'
                size={12}
                color={Colors.textFaded}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      }
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.loadingMore}>
            <ActivityIndicator size='small' color={Colors.textFaded} />
          </View>
        ) : null
      }
      renderItem={({ item, index }) => {
        const isFirst = index === 0
        const isLast = index === items.length - 1

        return (
          <View
            style={[
              styles.itemContainer,
              isFirst && styles.radiusTop,
              isLast && styles.radiusBottom,
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                onItemPress?.(item.id)
              }}
            >
              {item.item}
            </TouchableOpacity>
          </View>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  outerHeader: {
    paddingLeft: 6,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    paddingVertical: 8,
  },
  innerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 14,
  },
  headerIcon: {
    paddingTop: 3,
    paddingLeft: 5,
  },
  itemContainer: {
    paddingVertical: 8,
    backgroundColor: Colors.listContainer,
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
    paddingBottom: 90,
  },
  radiusTop: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  radiusBottom: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
})
