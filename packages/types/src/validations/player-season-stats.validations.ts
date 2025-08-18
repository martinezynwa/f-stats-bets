import { z } from 'zod'

export const getPlayerSeasonStatsSchema = z.object({
  season: z.number(),
  leagueIds: z.array(z.number()).optional(),
  playerIds: z.array(z.number()).optional(),
})

export type GetPlayerSeasonStatsSchema = z.infer<typeof getPlayerSeasonStatsSchema>

export const insertPlayerSeasonStatsValidationSchema = z.object({
  season: z.number(),
  leagueIds: z.array(z.number()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export type InsertPlayerSeasonStatsValidationSchema = z.infer<
  typeof insertPlayerSeasonStatsValidationSchema
>
