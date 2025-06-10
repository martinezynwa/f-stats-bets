import { BetResultType } from '@f-stats-bets/types'
import { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { Colors, Text } from '@/ui'

interface BetActionButtonsProps {
  onAction: (value: BetResultType) => void
  checkIsButtonActive: (value: BetResultType) => boolean
  disabled?: boolean
  isLoading?: boolean
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
  isLoading,
}: BetActionButtonsProps) => {
  const [buttonPressed, setButtonPressed] = useState<BetResultType | null>(null)

  useEffect(() => {
    if (buttonPressed && !isLoading) {
      setButtonPressed(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  const renderButton = (value: string, key: BetResultType) => {
    const isActive = checkIsButtonActive(key)
    const isPressed = buttonPressed === key

    const getCustomStyle = () => {
      if (disabled) return styles.betButtonDisabled
      if (isActive) return styles.betButtonActive
      return styles.betButtonInactive
    }

    return (
      <TouchableOpacity
        key={key}
        style={[styles.betButton, getCustomStyle(), isPressed && isLoading && styles.buttonBlurred]}
        onPress={() => {
          setButtonPressed(key)
          onAction(key)
        }}
        disabled={isLoading || disabled}
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
  buttonBlurred: { opacity: 0.5 },
})
