import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'
import { commonInputContainerStyle, commonInputLabelStyle, commonInputStyle } from '../styles'

import { FormText } from './FormText'

export type SelectListItem = {
  key: string
  value: string
  icon?: React.ReactNode
}

interface Props {
  name: string
  label: string
  selectTitle: string
  placeholder?: string
  data: SelectListItem[]
  customSnapPoints?: string[]
  required?: boolean
  customOnChange?: (value: string) => void
  disabled?: boolean
  isLoading?: boolean
}

export const SelectListModalForm = ({
  name,
  label,
  data,
  placeholder,
  customSnapPoints,
  selectTitle,
  required,
  customOnChange,
  disabled,
  isLoading,
}: Props) => {
  const { control } = useFormContext()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const CustomBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
      style={[props.style, { backgroundColor: Colors.bottomSheetBlurred }]}
    />
  )

  const manipulateBottomSheet = (action: 'open' | 'close') => {
    if (action === 'open') {
      bottomSheetRef.current?.present()
    } else if (action === 'close') {
      bottomSheetRef.current?.dismiss()
    }
  }

  const optionsMap = new Map(data.map(item => [item.key, item]))

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, formState }) => {
        const selectedItem = optionsMap.get(value)
        const selectedValue = selectedItem ? selectedItem.value : placeholder

        return (
          <>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => manipulateBottomSheet('open')}
              disabled={disabled}
            >
              <View style={styles.container}>
                <FormText
                  label={label}
                  required={required}
                  errorText={formState.errors[name]?.message?.toString() || ''}
                />

                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    value={selectedValue}
                    placeholderTextColor={Colors.text}
                    editable={false}
                    pointerEvents='none'
                  />

                  <View style={{ bottom: 4 }}>
                    {isLoading ? (
                      <ActivityIndicator size='small' color={Colors.indicatorIcon} />
                    ) : (
                      <FontAwesome5 name='chevron-down' size={16} color={Colors.indicatorIcon} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <BottomSheetModal
              ref={bottomSheetRef}
              index={1}
              snapPoints={customSnapPoints || ['80%']}
              enablePanDownToClose
              backdropComponent={CustomBackdrop}
              backgroundStyle={{
                backgroundColor: Colors.bottomSheetBackground,
              }}
              handleIndicatorStyle={{
                backgroundColor: Colors.bottomSheetIndicatorColor,
              }}
            >
              <BottomSheetView style={styles.bottomSheetContent}>
                <Text style={styles.listLabel} variant='lg' fontWeight={600}>
                  {selectTitle}
                </Text>

                <View style={styles.listContainer}>
                  {data.map(item => {
                    const isItemSelected = item.key === value

                    return (
                      <View
                        key={item.key}
                        style={[styles.listItem, isItemSelected && styles.listItemSelected]}
                        onTouchStart={() => {
                          customOnChange?.(item.key)
                          onChange(item.key)
                          manipulateBottomSheet('close')
                        }}
                      >
                        {item.icon}
                        <Text variant='md'>{item.value}</Text>
                      </View>
                    )
                  })}
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </>
        )
      }}
    />
  )
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 6,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 20,
  },
  inputContainer: commonInputContainerStyle,
  container: {
    width: '100%',
    gap: 4,
  },
  label: commonInputLabelStyle,
  inputRow: {
    flexDirection: 'row',
  },
  input: {
    ...commonInputStyle,
    flex: 1,
  },
  listContainer: {
    backgroundColor: Colors.bottomSheetItemsContainer,
    width: '100%',
    borderRadius: 12,
  },
  listLabel: { paddingTop: 4, paddingLeft: 6 },
  listItem: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    paddingVertical: 16,
    paddingLeft: 8,
  },
  listItemSelected: {
    backgroundColor: Colors.bottomSheetItemsSelected,
    borderRadius: 8,
  },
})
