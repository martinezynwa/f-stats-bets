export const limitDecimalPlaces = (value: number) => Math.round(value * 10 ** 2) / 10 ** 2
export const getNumberValue = (value: number | null | undefined) => value ?? 0
export const getStringValue = (value: string | null | undefined) => value ?? ''
export const stopFunction = (time?: number): Promise<void> =>
  new Promise<void>(resolve => setTimeout(resolve, time ?? 250))
export const log = (message: string) => console.log(message) // eslint-disable-line no-console
