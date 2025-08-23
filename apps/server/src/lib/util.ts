export const limitDecimalPlaces = (value: number) => Math.round(value * 10 ** 2) / 10 ** 2
export const getNumberValue = (value: number | null | undefined) => value ?? 0
export const getStringValue = (value: string | null | undefined) => value ?? ''
