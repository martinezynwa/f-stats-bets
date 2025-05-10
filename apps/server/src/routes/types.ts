import { z } from 'zod'

export const fetchFixturesValidationSchema = z.object({
  externalLeagueIds: z.array(z.number()),
  season: z.number().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})
