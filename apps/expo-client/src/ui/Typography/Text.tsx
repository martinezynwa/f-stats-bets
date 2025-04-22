import React from 'react'
import {
  Text as RNText,
  StyleSheet,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from 'react-native'

import { baseColors } from '../colors'

export type TextVariant = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xl2' | 'xl3'

interface CustomTextProps extends TextProps {
  variant?: TextVariant
  fontWeight?: TextStyle['fontWeight']
  disabled?: boolean
  uppercase?: boolean
  error?: boolean
  color?: keyof typeof baseColors
  textAlign?: TextStyle['textAlign']
  dynamicTextSize?: boolean
  style?: StyleProp<TextStyle>
}

export const Text = ({
  variant = 'md',
  style,
  children,
  fontWeight,
  disabled,
  uppercase,
  error,
  color,
  textAlign,
  dynamicTextSize,
  ...rest
}: CustomTextProps) => {
  const mergedStyles = [
    commonTextStyles,
    styles[variant],
    fontWeight && { fontWeight },
    disabled && styles.disabled,
    uppercase && styles.uppercase,
    error && styles.error,
    color && { color: color },
    textAlign && { textAlign },
    style,
    dynamicTextSize && getFontVariant(children as string),
  ]

  return (
    <RNText style={mergedStyles} {...rest}>
      {children}
    </RNText>
  )
}

const styles = StyleSheet.create({
  xxs: { fontSize: 8 },
  xs: { fontSize: 10 },
  sm: { fontSize: 12 },
  md: { fontSize: 16 },
  lg: { fontSize: 20 },
  xl: { fontSize: 24 },
  xl2: { fontSize: 32 },
  xl3: { fontSize: 40 },
  xl4: { fontSize: 48 },
  disabled: {
    color: baseColors.gray,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
  error: {
    color: 'red',
  },
})

const getFontVariant = (text: string) => {
  if (text.length <= 25) return styles.lg
  if (text.length <= 30) return styles.md
  return styles.xs
}

export const commonTextStyles: TextStyle = {
  color: baseColors.white,
}
