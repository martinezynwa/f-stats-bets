import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'

export interface SubmitButtonProps {
  title: string
  onPress?: () => void
  disabled?: boolean
  fullWidth?: boolean
  danger?: boolean
  loading?: boolean
  align?: 'left' | 'right' | 'center'
}

export const SubmitButton = ({
  title,
  onPress,
  disabled,
  fullWidth,
  danger,
  loading,
  align = 'center',
}: SubmitButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        disabled && !danger && styles.disabledButton,
        !disabled && danger && styles.danger,
        fullWidth && styles.fullWidth,
        align === 'left' && styles.alignLeft,
        align === 'right' && styles.alignRight,
      ]}
    >
      {loading ? (
        <ActivityIndicator size='small' color='white' />
      ) : (
        <Text fontWeight={600} disabled={disabled}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.submitButton,
  },
  disabledButton: { backgroundColor: Colors.disabledButton },
  fullWidth: { width: '100%' },
  danger: { backgroundColor: Colors.deleteButton },
  alignLeft: { alignItems: 'flex-start' },
  alignRight: { alignItems: 'flex-end' },
})
