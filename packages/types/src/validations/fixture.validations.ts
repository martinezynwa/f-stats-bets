import { z } from 'zod'
import { datePeriodSchema } from './shared.validations'

export const fixturesBetsSchema = z
  .object({
    leagueIds: z.array(z.string()).optional(),
  })
  .merge(datePeriodSchema)

export type FixturesBetsSchema = z.infer<typeof fixturesBetsSchema>
