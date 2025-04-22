import { addDays, format, parseISO } from 'date-fns'

export const getCurrentDateAndTime = () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")
export const getCurrentDate = () => format(new Date(), 'yyyy-MM-dd')
export const formatDateToCustom = (date: Date, customFormat?: string) =>
  format(date, customFormat ?? 'yyyy-MM-dd')
export const formatDateToFull = (date: Date) => format(date, 'do MMMM yyyy')
export const formatStringDateToDate = (date: string) => new Date(parseISO(date))
export const adjustCurrentDateByDays = (days: number) =>
  format(addDays(new Date(), days), 'yyyy-MM-dd')
export const getDateWithTimeShort = (date: string) => format(parseISO(date), 'd.M · HH:mm')
