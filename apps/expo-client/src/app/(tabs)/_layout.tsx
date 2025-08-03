import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Redirect, Tabs } from 'expo-router'
import React, { useCallback } from 'react'

import { scrollToTopEmitter } from '@/lib/scrollToTop'
import { useAuth } from '@/providers/AuthProvider'
import { Colors } from '@/ui/colors'

type IconProps = {
  name: React.ComponentProps<typeof FontAwesome6>['name']
  color: string
}

type Tab = {
  name: string
  label: string
  iconName: IconProps['name']
}

const TabBarIcon = ({ name, color }: IconProps) => (
  <FontAwesome6 name={name} size={24} color={color} />
)

export default function TabLayout() {
  const { session, authLoading } = useAuth()

  const tabPress = useCallback(() => {
    scrollToTopEmitter.emit('scrollToTop')
  }, [])

  if (authLoading) {
    return null
  }

  if (!session) {
    return <Redirect href='/(auth)/sign-in' />
  }

  const tabs: Tab[] = [
    {
      name: '(index)',
      label: 'Dashboard',
      iconName: 'house',
    },
    {
      name: '(bets)',
      label: 'Bets',
      iconName: 'list',
    },
    {
      name: '(profile)',
      label: 'Profile',
      iconName: 'user',
    },
  ]

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 0,
          position: 'absolute',
          backgroundColor: Colors.footerBackground,
          paddingTop: 4,
        },
        tabBarActiveTintColor: Colors.tabBarActiveTintColor,
        tabBarInactiveTintColor: Colors.tabBarInactiveTintColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarIconStyle: {
          marginBottom: 2,
        },
      }}
    >
      {tabs.map(({ name, label, iconName }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                name={iconName}
                color={focused ? Colors.tabBarActiveTintColor : Colors.tabBarInactiveTintColor}
              />
            ),
          }}
          listeners={{ tabPress }}
        />
      ))}
    </Tabs>
  )
}
