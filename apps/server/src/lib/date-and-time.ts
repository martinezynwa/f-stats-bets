import { endOfDay, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'

export const isDateInRange = (date: string, from?: string, to?: string): boolean => {
  const fixtureDate = startOfDay(parseISO(date))
  const fromDate = from ? startOfDay(parseISO(from)) : null
  const toDate = to ? endOfDay(parseISO(to)) : null

  return (
    (!fromDate || !isBefore(fixtureDate, fromDate)) && (!toDate || !isAfter(fixtureDate, toDate))
  )
}
