import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import { SubmitButton } from '../Components'
import { Text } from '../Typography/Text'
import { Colors } from '../colors'
import { commonInputContainerStyle, commonInputLabelStyle, commonInputStyle } from '../styles'

import { FormText } from './FormText'

export type SelectListItem = {
  key: string | number
  value: string
  icon?: React.ReactNode
}

type SelectValue = string | number | (string | number)[] | undefined

interface Props {
  name: string
  label: string
  selectTitle: string
  placeholder?: string
  data: SelectListItem[]
  customSnapPoints?: string[]
  required?: boolean
  customOnChange?: (value: SelectValue) => void
  disabled?: boolean
  isLoading?: boolean
  multiSelect?: boolean
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
  multiSelect = false,
}: Props) => {
  const { control } = useFormContext()
  const bottomSheetRef = useRef<BottomSheetModal>(null)

  const manipulateBottomSheet = (action: 'open' | 'close') => {
    if (action === 'open') {
      bottomSheetRef.current?.present()
    } else if (action === 'close') {
      bottomSheetRef.current?.dismiss()
    }
  }

  const optionsMap = new Map(data.map(item => [item.key.toString(), item]))

  const formatSelectedValue = (value: SelectValue) => {
    if (!value) return placeholder
    if (typeof value === 'string' || typeof value === 'number') {
      return optionsMap.get(value.toString())?.value || placeholder
    }
    if (value.length > 1) return 'Multiple values selected'
    return value.length === 1
      ? optionsMap.get(value[0].toString())?.value || placeholder
      : placeholder
  }

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, formState }) => {
        const handleItemPress = (key: string | number) => {
          if (multiSelect) {
            const currentValue = Array.isArray(value) ? value : []
            const newValue = currentValue.includes(key)
              ? currentValue.filter(k => k !== key)
              : [...currentValue, key]
            onChange(newValue)
            customOnChange?.(newValue)
          } else {
            onChange(key)
            customOnChange?.(key)
            manipulateBottomSheet('close')
          }
        }

        const handleConfirm = () => {
          manipulateBottomSheet('close')
        }

        const displayValue = formatSelectedValue(value)
        const selectedValues = Array.isArray(value) ? value : []

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
                    value={displayValue}
                    placeholderTextColor={Colors.text}
                    editable={false}
                    pointerEvents='none'
                  />

                  <View style={{ bottom: 4 }}>
                    {isLoading ? (
                      <ActivityIndicator size='small' color={Colors.indicatorIcon} />
                    ) : (
                      <FontAwesome5
                        name='chevron-down'
                        size={16}
                        color={disabled ? Colors.textFaded : Colors.indicatorIcon}
                      />
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
              backdropComponent={(props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                  {...props}
                  appearsOnIndex={0}
                  disappearsOnIndex={-1}
                  opacity={0.5}
                  style={[props.style, { backgroundColor: Colors.bottomSheetBlurred }]}
                />
              )}
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

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                  <View style={styles.listContainer}>
                    {data.map(item => {
                      const isItemSelected = multiSelect
                        ? selectedValues.includes(item.key)
                        : item.key === value

                      return (
                        <TouchableOpacity
                          key={item.key}
                          style={[
                            styles.listItem,
                            isItemSelected && !multiSelect && styles.listItemSelected,
                          ]}
                          onPress={() => handleItemPress(item.key)}
                        >
                          {multiSelect && (
                            <View style={[styles.checkbox]}>
                              {isItemSelected && (
                                <FontAwesome5 name='check' size={12} color='#FFFFFF' />
                              )}
                            </View>
                          )}
                          {item.icon}
                          <Text variant='md' fontWeight={isItemSelected ? 700 : 400}>
                            {item.value}
                          </Text>
                        </TouchableOpacity>
                      )
                    })}
                  </View>
                </ScrollView>

                {multiSelect && (
                  <View style={{ width: '100%', marginBottom: 64 }}>
                    <SubmitButton
                      fullWidth
                      title={`${selectedValues.length} items selected`}
                      onPress={handleConfirm}
                    />
                  </View>
                )}
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
    width: '100%',
  },
  scrollContainer: {
    width: '100%',
    flex: 1,
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
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.bottomSheetItemsSelected,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
