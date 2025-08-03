import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

export interface OnScrollProps {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}
