import { addDays, endOfDay, format, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'

export const isDateInRange = (date: string, from?: string, to?: string): boolean => {
  const fixtureDate = startOfDay(parseISO(date))
  const fromDate = from ? startOfDay(parseISO(from)) : null
  const toDate = to ? endOfDay(parseISO(to)) : null

  return (
    (!fromDate || !isBefore(fixtureDate, fromDate)) && (!toDate || !isAfter(fixtureDate, toDate))
  )
}

export const adjustDateByDays = (days: number) => format(addDays(new Date(), days), 'yyyy-MM-dd')

export const isSelectedDateWithinPeriod = (
  selectedDate: string,
  dateFrom: string,
  dateTo: string,
): boolean =>
  (isAfter(parseISO(selectedDate), parseISO(dateFrom)) ||
    parseISO(selectedDate).getTime() === parseISO(dateFrom).getTime()) &&
  (isBefore(parseISO(selectedDate), parseISO(dateTo)) ||
    parseISO(selectedDate).getTime() === parseISO(dateTo).getTime())

export const formatDate = (date: Date, withTime?: boolean) =>
  format(date, withTime ? "yyyy-MM-dd'T'HH:mm:ssXXX" : 'yyyy-MM-dd')
