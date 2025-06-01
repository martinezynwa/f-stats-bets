import { z } from 'zod'

export const mockBetsSchema = z.object({
  userId: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  deletePreviousBets: z.boolean().optional(),
  betCompetitionId: z.string(),
})

export type MockBetsSchema = z.infer<typeof mockBetsSchema>

export const mockBetCompetitionsSchema = z.object({
  userId: z.string(),
  externalLeagueIds: z.array(z.number()),
  season: z.number(),
  name: z.string(),
  deletePrevious: z.boolean().optional(),
})

export type MockBetCompetitionsSchema = z.infer<typeof mockBetCompetitionsSchema>
