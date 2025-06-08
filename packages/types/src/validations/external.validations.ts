import { z } from 'zod'

export const insertLeagueValidationSchema = z.object({
  externalLeagueId: z.number(),
  season: z.number(),
})
export type InsertLeagueValidationSchema = z.infer<typeof insertLeagueValidationSchema>

export const insertTeamValidationSchema = z.object({
  leagueId: z.string(),
  externalLeagueId: z.number(),
  season: z.number(),
})
export type InsertTeamValidationSchema = z.infer<typeof insertTeamValidationSchema>

export const insertFixturesValidationSchema = z.object({
  externalLeagueIds: z.array(z.number()),
  season: z.number(),
  dateFrom: z.string(),
  dateTo: z.string(),
})
export type InsertFixturesValidationSchema = z.infer<typeof insertFixturesValidationSchema>
