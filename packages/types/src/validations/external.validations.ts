import { z } from 'zod'

export const insertLeagueValidationSchema = z.object({
  leagueId: z.number(),
  season: z.number(),
})
export type InsertLeagueValidationSchema = z.infer<typeof insertLeagueValidationSchema>

export const insertTeamValidationSchema = z.object({
  leagueId: z.number(),
  season: z.number(),
})
export type InsertTeamValidationSchema = z.infer<typeof insertTeamValidationSchema>

export const insertFixturesValidationSchema = z.object({
  leagueIds: z.array(z.number()),
  season: z.number(),
  dateFrom: z.string(),
  dateTo: z.string(),
})
export type InsertFixturesValidationSchema = z.infer<typeof insertFixturesValidationSchema>

export const initLeaguesValidationSchema = z.object({
  leagueIds: z.array(z.number()),
  season: z.number(),
})
export type InitLeaguesValidationSchema = z.infer<typeof initLeaguesValidationSchema>

export const initSupportedLeaguesValidationSchema = z.object({
  season: z.number(),
})
export type InitSupportedLeaguesValidationSchema = z.infer<
  typeof initSupportedLeaguesValidationSchema
>

export const insertPlayersValidationSchema = z.object({
  leagueIds: z.array(z.number()).optional(),
  teamIds: z.array(z.number()).optional(),
  season: z.number(),
})
export type InsertPlayersValidationSchema = z.infer<typeof insertPlayersValidationSchema>
