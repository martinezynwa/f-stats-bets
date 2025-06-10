import { z } from 'zod'
import { BetResultType } from '../database.types'

export const userBetsSchema = z.object({
  userId: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
})
export type UserBetsSchema = z.infer<typeof userBetsSchema>

export const userBetsFromFixtureIdsSchema = z.object({
  userId: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  betCompetitionId: z.string().optional(),
})
export type UserBetsFromFixtureIdsSchema = z.infer<typeof userBetsFromFixtureIdsSchema>

export const createBetSchema = z.object({
  fixtureId: z.number(),
  leagueId: z.string(),
  season: z.number(),
  userId: z.string(),
  betCompetitionId: z.string(),
  fixtureResultBet: z.nativeEnum(BetResultType),
})
export type CreateBetSchema = z.infer<typeof createBetSchema>

export const updateBetSchema = z.object({
  betId: z.string(),
  fixtureResultBet: z.nativeEnum(BetResultType),
})
export type UpdateBetSchema = z.infer<typeof updateBetSchema>

export const deleteBetSchema = z.object({
  betId: z.string(),
})
export type DeleteBetSchema = z.infer<typeof deleteBetSchema>
