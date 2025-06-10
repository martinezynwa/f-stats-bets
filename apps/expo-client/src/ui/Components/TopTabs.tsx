import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import type { ComponentType } from 'react'

import { Colors } from '../colors'

const Tab = createMaterialTopTabNavigator()

export type TabProps = {
  name: string
  component: ComponentType
}

interface Props {
  tabs: TabProps[]
}

export const TopTabs = ({ tabs }: Props) => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.topTabBarText,
        tabBarInactiveTintColor: Colors.topTabBarText,
        tabBarLabelStyle: {
          fontSize: 15,
          textTransform: 'none',
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: Colors.topTabBarBackground,
        },
        tabBarIndicatorStyle: {
          backgroundColor: Colors.topTabBarIndicator,
        },
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  )
}
