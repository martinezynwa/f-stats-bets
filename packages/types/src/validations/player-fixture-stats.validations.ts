import { z } from 'zod'

export const getPlayerFixtureStatsSchema = z.object({
  season: z.number(),
  leagueIds: z.array(z.number()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type GetPlayerFixtureStatsSchema = z.infer<typeof getPlayerFixtureStatsSchema>
