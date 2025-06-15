import { isAfter } from 'date-fns'

export const hasGameStarted = (fixtureDate: string) => isAfter(new Date(), new Date(fixtureDate))
