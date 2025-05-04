import { z } from 'zod'

export const seedValidationSchema = z.object({
  leagueIds: z.array(z.string()).optional(),
  season: z.number().optional(),
})
