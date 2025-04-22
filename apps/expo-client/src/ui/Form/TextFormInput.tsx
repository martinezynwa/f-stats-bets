import React, { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'
import { commonInputContainerStyle, commonInputStyle } from '../styles'

import { FormText } from './FormText'

interface Props {
  name: string
  label: string
  type: 'text' | 'number'
  required?: boolean
  disabled?: boolean
  suffix?: string
}

export const TextFormInput = ({ name, label, type, required, disabled, suffix }: Props) => {
  const { control } = useFormContext()
  const inputRef = useRef<TextInput>(null)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, formState }) => (
        <TouchableWithoutFeedback onPress={() => !disabled && inputRef.current?.focus()}>
          <View style={styles.container}>
            <FormText
              label={label}
              required={required}
              errorText={formState.errors[name]?.message?.toString() || ''}
            />

            <View style={styles.inputContainer}>
              <TextInput
                ref={inputRef}
                style={[styles.input, suffix && styles.inputWithSuffix]}
                onChangeText={e => {
                  if (disabled) return
                  if (type === 'number') {
                    const cleaned = e.replace(/[^0-9.,]/g, '')
                    if (!cleaned) return onChange(null)

                    const normalized = cleaned.replace(',', '.')
                    if ((normalized.match(/\./g) || []).length > 1) return

                    onChange(normalized.endsWith('.') ? normalized : Number(normalized))
                  } else {
                    onChange(e.slice(0, 30))
                  }
                }}
                value={value === null ? '' : value?.toString()}
                keyboardType={type === 'number' ? 'decimal-pad' : 'default'}
                placeholderTextColor={Colors.text}
                editable={!disabled}
              />
              {suffix && <Text style={styles.suffix}>{suffix}</Text>}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: commonInputContainerStyle,
  input: {
    ...commonInputStyle,
    flex: 1,
  },
  inputWithSuffix: {
    paddingRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suffix: {
    color: Colors.text,
    marginBottom: 10,
  },
})
