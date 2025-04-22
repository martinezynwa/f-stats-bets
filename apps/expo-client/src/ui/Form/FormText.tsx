import { StyleSheet, View } from 'react-native'

import { Text } from '../Typography/Text'
import { commonInputLabelStyle } from '../styles'

interface Props {
  label: string
  required?: boolean
  errorText?: string
}

export const FormText = ({ label, required, errorText }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {!required && '(optional)'}
      </Text>

      {errorText && (
        <Text variant='xxs' error>
          {errorText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  label: commonInputLabelStyle,
})
