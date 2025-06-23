import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import { baseColors, Colors } from '../colors'
import { commonInputContainerStyle, commonInputLabelStyle, commonInputStyle } from '../styles'

import { FormText } from './FormText'

import { formatDateToFull, formatStringDateToDate } from '@/lib/util'

interface Props {
  name: string
  label: string
  mode?: 'datetime' | 'date'
  required?: boolean
}

export const DatePickerForm = ({ name, label, mode, required }: Props) => {
  const { control } = useFormContext()
  const [showPicker, setShowPicker] = useState(false)

  const getValue = (value: string | Date) => {
    if (!value) {
      return new Date()
    }

    if (value instanceof Date) {
      return value
    }

    return formatStringDateToDate(value)
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, formState }) => (
        <>
          <TouchableOpacity style={styles.container} onPress={() => setShowPicker(true)}>
            <FormText
              label={label}
              required={required}
              errorText={formState.errors[name]?.message?.toString() || ''}
            />

            <TextInput
              style={styles.input}
              value={formatDateToFull(value ? value : new Date())}
              placeholderTextColor={Colors.text}
              editable={false}
              pointerEvents='none'
            />
          </TouchableOpacity>

          <DateTimePickerModal
            date={getValue(value)}
            isVisible={showPicker}
            mode={mode}
            onChange={date => onChange(date.toISOString())}
            onConfirm={() => setShowPicker(false)}
            onCancel={() => setShowPicker(false)}
            textColor={baseColors.black}
            accentColor={baseColors.black}
            buttonTextColorIOS={baseColors.black}
            backdropStyleIOS={{ backgroundColor: Colors.background }}
          />
        </>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: commonInputContainerStyle,
  label: commonInputLabelStyle,
  input: commonInputStyle,
})
