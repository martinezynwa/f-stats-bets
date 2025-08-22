import { z } from 'zod'

export const teamsValidationSchema = z.object({
  season: z.number(),
  leagueIds: z.array(z.number()).optional(),
})

export type TeamsValidationSchema = z.infer<typeof teamsValidationSchema>
