import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { FlashList } from '@shopify/flash-list'
import { ReactNode } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'
import { APP_PADDING_HORIZONTAL, APP_PADDING_TOP, PAGE_BOTTOM_PADDING } from '../styles'

type ListItemType = {
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
  onRefresh?: () => void
  isRefreshing?: boolean
  verticalSpace?: boolean
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
}: ListProps) => {
  return (
    <FlashList
      estimatedItemSize={50}
      data={items}
      keyExtractor={item => item.id}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={{
        paddingBottom: verticalSpace ? PAGE_BOTTOM_PADDING : 0,
        paddingTop: verticalSpace ? APP_PADDING_TOP : 0,
        paddingHorizontal: APP_PADDING_HORIZONTAL,
      }}
      refreshControl={
        onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined
      }
      ListHeaderComponent={
        <View>
          {outerHeader && (
            <TouchableOpacity style={styles.outerHeader} onPress={onOuterHeaderPress}>
              <Text fontWeight={600} variant='lg'>
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
    paddingBottom: 16,
    paddingLeft: 4,
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
    paddingHorizontal: 12,
    backgroundColor: Colors.box,
  },
  deleteButton: {
    position: 'absolute',
    right: -44,
    width: 30,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
    paddingBottom: 90,
  },
  radiusTop: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  radiusBottom: { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
})
