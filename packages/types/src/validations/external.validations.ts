import { z } from 'zod'
import { FixtureStatus } from '../types'

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
  shouldMockResponse: z.boolean().optional(),
})
export type InsertPlayersValidationSchema = z.infer<typeof insertPlayersValidationSchema>

export const fetchPlayersProfilesValidationSchema = z.object({
  playerIds: z.array(z.number()),
})
export type FetchPlayersProfilesValidationSchema = z.infer<
  typeof fetchPlayersProfilesValidationSchema
>

export const fetchPlayerFixtureStatsValidationSchema = z.object({
  fixtureIds: z.array(z.number()),
})
export type FetchPlayerFixtureStatsValidationSchema = z.infer<
  typeof fetchPlayerFixtureStatsValidationSchema
>

export const insertPlayerFixtureStatsValidationSchema = z.object({
  fixtureIds: z.array(z.number()).optional(),
  leagueIds: z.array(z.number()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  status: z.array(z.enum(Object.values(FixtureStatus) as [string, ...string[]])).optional(),
})
export type InsertPlayerFixtureStatsValidationSchema = z.infer<
  typeof insertPlayerFixtureStatsValidationSchema
>

export const fetchPlayerSeasonStatisticsValidationSchema = z.object({
  playerIds: z.array(z.number()),
  seasons: z.array(z.number()),
})
export type FetchPlayerSeasonStatisticsValidationSchema = z.infer<
  typeof fetchPlayerSeasonStatisticsValidationSchema
>

export const insertPlayerSeasonStatisticsValidationSchema = z.object({
  playerIds: z.array(z.number()),
  seasons: z.array(z.number()),
})
export type InsertPlayerSeasonStatisticsValidationSchema = z.infer<
  typeof insertPlayerSeasonStatisticsValidationSchema
>
