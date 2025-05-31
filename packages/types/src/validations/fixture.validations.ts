import { z } from 'zod'
import { datePeriodSchema } from './shared.validations'

export const fixturesBetsSchema = z
  .object({
    leagueIds: z.array(z.string()).optional(),
  })
  .merge(datePeriodSchema)

export type FixturesBetsSchema = z.infer<typeof fixturesBetsSchema>

export const fixturesSchema = z
  .object({
    externalLeagueIds: z.array(z.number()).optional(),
    season: z.string().optional(),
    leagueIdSort: z.string().optional(),
  })
  .merge(datePeriodSchema)

export type FixturesSchema = z.infer<typeof fixturesSchema>
