import { z } from 'zod'

export const teamsValidationSchema = z.object({
  leagueId: z.number(),
  season: z.number(),
})

export type TeamsValidationSchema = z.infer<typeof teamsValidationSchema>
