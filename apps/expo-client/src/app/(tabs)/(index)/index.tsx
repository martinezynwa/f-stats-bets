import { View } from 'react-native'

import { Home } from '@/components/Home'
import { HorizontalDatePicker, ScreenWrapper } from '@/ui'

export default function HomeScreen() {
  return (
    <ScreenWrapper>
      <View style={{ paddingTop: 60 }}>
        <HorizontalDatePicker />
      </View>

      <Home />
    </ScreenWrapper>
  )
}
