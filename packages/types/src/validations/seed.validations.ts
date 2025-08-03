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
  shouldIgnoreBaseData: z.boolean().optional(),
})

export type SeedFromExternalApiValidationSchema = z.infer<
  typeof seedFromExternalApiValidationSchema
>

export const seedAllTablesValidationSchema = z.object({
  seasons: z.array(z.number()),
  fixtureExternalLeagueIds: z.array(z.number()).optional(),
  fixtureDateFrom: z.string().optional(),
  fixtureDateTo: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  deletePrevious: z.boolean().optional(),
  shouldMockBetData: z.boolean().optional(),
})
export type SeedAllTablesValidationSchema = z.infer<typeof seedAllTablesValidationSchema>

export const seedSpecificTablesValidationSchema = z
  .object({
    tablesWithoutRelations: z.array(z.string()).optional(),
    tablesWithRelations: z.array(z.string()).optional(),
  })
  .refine(
    data => {
      return (
        (data.tablesWithoutRelations?.length ?? 0) > 0 ||
        (data.tablesWithRelations?.length ?? 0) > 0
      )
    },
    {
      message:
        "At least one of 'tablesWithoutRelations' or 'tablesWithRelations' must be provided with at least one item",
    },
  )
export type SeedSpecificTablesValidationSchema = z.infer<typeof seedSpecificTablesValidationSchema>
