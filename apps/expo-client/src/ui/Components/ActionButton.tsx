import { StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'

interface Props {
  onPress: () => void
  text: string
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

export const ActionButton = ({ onPress, text, iconLeft, iconRight }: Props) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      {iconLeft}
      <Text fontWeight={500}>{text}</Text>
      {iconRight}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: Colors.actionButton,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
})
