import { z } from 'zod'

export const teamsValidationSchema = z.object({
  externalLeagueId: z.number(),
  season: z.number(),
})

export type TeamsValidationSchema = z.infer<typeof teamsValidationSchema>
