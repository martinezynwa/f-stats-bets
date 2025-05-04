import { z } from 'zod'

export const leagueSchema = z.object({
  leagueId: z.number(),
  seasonId: z.number(),
  type: z.string(),
})
