import { z } from 'zod'

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
