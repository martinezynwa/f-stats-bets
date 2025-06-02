import { addDays, format, isSameDay, isToday, subDays } from 'date-fns'
import React, { useMemo, useRef } from 'react'
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { create } from 'zustand'

import { Text } from '../Typography/Text'
import { Colors } from '../colors'

import { useTranslation } from '@/i18n/useTranslation'

export const HorizontalDatePicker = () => {
  const { locale } = useTranslation()
  const { date: selectedDate, setDate: setSelectedDate } = useDatePickerStore()

  const initialSelectedDate = useRef(new Date(selectedDate))
  const startDate = subDays(initialSelectedDate.current, MAX_DAYS_PAST)
  const endDate = addDays(initialSelectedDate.current, MAX_DAYS_FUTURE)

  const availableDays = useMemo(() => {
    const arr = []
    let d = startDate
    while (d <= endDate) {
      arr.push(new Date(d))
      d = addDays(d, 1)
    }
    return arr
  }, [startDate, endDate])

  const initialOffset = Math.max(
    (availableDays.findIndex(d => isSameDay(d, initialSelectedDate.current)) - CENTER_INDEX) *
      DAY_WIDTH,
    0,
  )

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: initialOffset, y: 0 }}
      >
        {availableDays.map(date => {
          const isSelected = isSameDay(date, new Date(selectedDate))
          const isCurrent = isToday(date)
          const dayName = format(date, 'EEE', { locale }).toUpperCase()
          const shouldHighlight = isSelected

          return (
            <TouchableOpacity
              key={date.toISOString()}
              style={styles.dayContainer}
              onPress={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
              disabled={isSelected}
              activeOpacity={0.7}
            >
              <Text
                variant='sm'
                fontWeight={600}
                style={[styles.dayName, shouldHighlight && styles.selectedName]}
              >
                {dayName}
              </Text>
              <Text
                variant='lg'
                fontWeight={700}
                style={[styles.dayNumber, shouldHighlight && styles.selectedNumber]}
              >
                {format(date, 'dd')}
              </Text>
              <Text
                variant='xs'
                fontWeight={600}
                style={[styles.monthName, shouldHighlight && styles.selectedMonth]}
              >
                {format(date, 'MMM', { locale }).toUpperCase()}
              </Text>
              {shouldHighlight && <View style={styles.selectedBar} />}
              {isCurrent && !isSelected && (
                <View style={{ ...styles.selectedBar, backgroundColor: Colors.textFaded }} />
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

export const useDatePickerStore = create<{
  date: string
  setDate: (newDate: string) => void
}>(set => ({
  date: format(new Date(), 'yyyy-MM-dd'),
  setDate: (newDate: string) => set({ date: newDate }),
}))

const MAX_DAYS_PAST = 14
const MAX_DAYS_FUTURE = 14
const DAY_WIDTH = 55
const screenWidth = Dimensions.get('window').width
const CENTER_INDEX = screenWidth / DAY_WIDTH / 2 - 0.5

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.horizontalDatePicker,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.horizontalDatePickerBottomBorder,
  },
  dayContainer: {
    width: DAY_WIDTH,
    paddingVertical: 2,
  },
  dayName: {
    color: Colors.textFaded,
    marginBottom: 2,
    letterSpacing: 1,
    textAlign: 'center',
    fontSize: 11,
  },
  selectedName: {
    color: Colors.horizontalDatePickerSelected,
  },
  dayNumber: {
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 2,
  },
  selectedNumber: {
    color: Colors.horizontalDatePickerSelected,
  },
  monthName: {
    color: Colors.textFaded,
    textAlign: 'center',
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 8,
  },
  selectedMonth: {
    color: Colors.horizontalDatePickerSelected,
  },
  selectedBar: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.horizontalDatePickerSelected,
  },
})
