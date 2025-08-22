import { z } from 'zod'

export const createPlayerToTeamValidationSchema = z.object({
  season: z.number(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  leagueIds: z.array(z.number()).optional(),
})
export type CreatePlayerToTeamValidationSchema = z.infer<typeof createPlayerToTeamValidationSchema>

export const createPlayerFromFixturesValidationSchema = z.object({
  season: z.number(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  leagueIds: z.array(z.number()).optional(),
})
export type CreatePlayerFromFixturesValidationSchema = z.infer<
  typeof createPlayerFromFixturesValidationSchema
>

export const createPlayerToTeamHistoryValidationSchema = z.object({
  playerSquadsSeason: z.number(),
  seasonHistoryInYears: z.number(),
  leagueIds: z.array(z.number()).optional(),
})
export type CreatePlayerToTeamHistoryValidationSchema = z.infer<
  typeof createPlayerToTeamHistoryValidationSchema
>
