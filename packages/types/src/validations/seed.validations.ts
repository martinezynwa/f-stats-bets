import { z } from 'zod'

export const seedValidationSchema = z.object({
  leagueIds: z.array(z.string()).optional(),
  season: z.number().optional(),
})
export type SeedValidationSchema = z.infer<typeof seedValidationSchema>

export const seedFromExternalApiValidationSchema = z.object({
  seasons: z.array(z.number()),
  dateFrom: z.string(),
  dateTo: z.string(),
})

export type SeedFromExternalApiValidationSchema = z.infer<
  typeof seedFromExternalApiValidationSchema
>

export const seedCustomDataSchema = z.object({
  seasons: z.array(z.number()),
  fixtureExternalLeagueIds: z.array(z.number()).optional(),
  fixtureDateFrom: z.string().optional(),
  fixtureDateTo: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  deletePrevious: z.boolean().optional(),
  betCompetitionName: z.string().optional(),
})

export type SeedCustomDataSchema = z.infer<typeof seedCustomDataSchema>

export const seedBaseDataValidationSchema = z
  .object({
    tablesWithRelations: z.array(z.string()).optional(),
    tablesWithoutRelations: z.array(z.string()).optional(),
    shouldMockCustomData: z.boolean().optional(),
  })
  .merge(seedCustomDataSchema)
export type SeedBaseDataValidationSchema = z.infer<typeof seedBaseDataValidationSchema>
