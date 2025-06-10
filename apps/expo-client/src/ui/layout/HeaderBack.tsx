import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'

import { Colors } from '../colors'

const pathsNotAllowed = ['']

export function HeaderBack() {
  const router = useRouter()
  const path = usePathname()

  if (pathsNotAllowed.includes(path)) {
    return null
  }

  return (
    <TouchableOpacity onPress={() => router.back()} style={{ right: 4 }}>
      <Ionicons name='arrow-back' size={24} color={Colors.headerBack} />
    </TouchableOpacity>
  )
}
