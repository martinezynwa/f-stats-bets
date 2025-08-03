import { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { TabBar, TabView } from 'react-native-tab-view'

import { Colors } from '../colors'

import { scrollToTopEmitter } from '@/lib/scrollToTop'

interface Props {
  routes: { key: string; title: string }[]
  screens: { [key: string]: () => React.ReactNode }
}

export const TopTabs = ({ routes, screens }: Props) => {
  const layout = useWindowDimensions()
  const [index, setIndex] = useState(0)

  const handleTabPress = () => {
    scrollToTopEmitter.emit('scrollToTop')
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={({ route }) => screens[route.key]()}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: Colors.topTabBarIndicator }}
          style={{
            backgroundColor: Colors.topTabBarBackground,
          }}
          onTabPress={handleTabPress}
        />
      )}
    />
  )
}
