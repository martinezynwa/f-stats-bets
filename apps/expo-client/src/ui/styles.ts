import { TextStyle, ViewStyle } from 'react-native'

import { Colors } from './colors'

export const commonInputContainerStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: 12,
  backgroundColor: Colors.box,
  height: 55,
  paddingHorizontal: 14,
  paddingTop: 8,
  paddingBottom: 12,
  width: '100%',
}

export const commonInputLabelStyle: ViewStyle & TextStyle = {
  fontSize: 13,
  color: Colors.text,
  opacity: 0.5,
}

export const commonInputStyle: TextStyle = {
  fontSize: 16,
  color: Colors.text,
  paddingTop: 0,
}

export const PAGE_BOTTOM_PADDING = 70
export const APP_PADDING_HORIZONTAL = 8
export const APP_PADDING_TOP = 12
