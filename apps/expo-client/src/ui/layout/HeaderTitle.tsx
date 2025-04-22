import { usePathname } from 'expo-router'
import { Text } from 'react-native'

import { getPathTitle } from '@/lib/routes'

export const HeaderTitle = () => {
  const path = usePathname()

  const { pathName } = getPathTitle(path)

  return <Text>{pathName}</Text>
}
