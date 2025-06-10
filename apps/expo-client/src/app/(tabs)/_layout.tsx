import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { Redirect, Tabs } from 'expo-router'
import React from 'react'

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
          backgroundColor: Colors.bottomNav,
        },
        tabBarActiveTintColor: Colors.bottomNavActive,
        tabBarInactiveTintColor: Colors.bottomNavInactive,
        tabBarLabelStyle: { fontSize: 12 },
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
                color={focused ? Colors.bottomNavActive : Colors.bottomNavInactive}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
