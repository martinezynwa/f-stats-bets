import { z } from 'zod'
import { datePeriodSchema } from './shared.validations'
import { FixtureStatus } from '../types'

export const fixturesBetsSchema = z
  .object({
    leagueIds: z.array(z.number()).optional(),
    season: z.string().optional(),
    userId: z.string().optional(),
    betCompetitionId: z.string(),
  })
  .merge(datePeriodSchema)

export type FixturesBetsSchema = z.infer<typeof fixturesBetsSchema>

export const fixturesSchema = z
  .object({
    leagueIds: z.array(z.number()).optional(),
    season: z.string().optional(),
    leagueIdSort: z.string().optional(),
  })
  .merge(datePeriodSchema)

export type FixturesSchema = z.infer<typeof fixturesSchema>

export const fixtureDetailsSchema = z.object({
  fixtureIds: z.array(z.number()).optional(),
  leagueIds: z.array(z.number()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.array(z.enum(Object.values(FixtureStatus) as [string, ...string[]])).optional(),
})
export type FixtureDetailsSchema = z.infer<typeof fixtureDetailsSchema>
