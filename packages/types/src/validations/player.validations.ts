import { z } from 'zod'

export const createPlayerToTeamValidationSchema = z.object({
  season: z.number(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  leagueIds: z.array(z.number()).optional(),
})
export type CreatePlayerToTeamValidationSchema = z.infer<typeof createPlayerToTeamValidationSchema>

export const createPlayerFromFixturesValidationSchema = z.object({
  season: z.number(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  leagueIds: z.array(z.number()).optional(),
})
export type CreatePlayerFromFixturesValidationSchema = z.infer<
  typeof createPlayerFromFixturesValidationSchema
>
