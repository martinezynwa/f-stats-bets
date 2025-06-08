import { BetResultType } from '@f-stats-bets/types'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { Colors, Text } from '@/ui'

interface BetActionButtonsProps {
  onAction: (value: BetResultType) => void
  checkIsButtonActive: (value: BetResultType) => boolean
  disabled?: boolean
}

const buttons = [
  { key: BetResultType.HOME_WIN, value: '1' },
  { key: BetResultType.DRAW, value: '0' },
  { key: BetResultType.AWAY_WIN, value: '2' },
]

export const BetResultActionButtons = ({
  onAction,
  checkIsButtonActive,
  disabled,
}: BetActionButtonsProps) => {
  const renderButton = (value: string, key: BetResultType) => {
    const isActive = checkIsButtonActive(key)

    return (
      <TouchableOpacity
        key={key}
        style={[
          styles.betButton,
          disabled
            ? styles.betButtonDisabled
            : isActive
              ? styles.betButtonActive
              : styles.betButtonDisabled,
        ]}
        onPress={() => onAction(key)}
        disabled={disabled}
      >
        <View style={styles.buttonContainer}>
          <Text>{value}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {buttons.map(({ key, value }) => renderButton(value, key))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 5,
    gap: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  betButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
  },
  betButtonActive: { backgroundColor: Colors.submitButton },
  betButtonInactive: { backgroundColor: Colors.inactiveButton },
  betButtonDisabled: { backgroundColor: Colors.disabledButton },
})
