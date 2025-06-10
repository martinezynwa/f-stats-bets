import { Stack } from 'expo-router'

import { Colors } from '@/ui/colors'

interface Props {
  name: string
  headerTitle: string
  largeHeader?: boolean
  headerTransparent?: boolean
  headerComponent?: React.ReactNode
}

export const HeaderLayout = ({
  headerTitle,
  name,
  largeHeader,
  headerTransparent,
  headerComponent,
}: Props) => {
  return (
    <Stack>
      <Stack.Screen
        name={name}
        options={{
          headerTitle,
          headerTransparent,
          headerBlurEffect: 'dark',
          header: headerComponent ? () => headerComponent : undefined,
          headerLargeTitle: largeHeader,
          headerLargeTitleStyle: {
            color: Colors.text,
          },
          headerTitleStyle: {
            fontSize: 20,
            color: Colors.text,
          },
        }}
      />
    </Stack>
  )
}
