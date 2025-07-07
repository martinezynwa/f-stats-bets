import { z } from 'zod'
import { COMMON_ERROR_TEXT, paginationProps } from './shared.validations'

export const createBetCompetitionSchema = z.object({
  season: z.number({ required_error: COMMON_ERROR_TEXT }),
  name: z.string({ required_error: COMMON_ERROR_TEXT }),
  dateStart: z.string({ required_error: COMMON_ERROR_TEXT }),
  dateEnd: z.string({ required_error: COMMON_ERROR_TEXT }),
  playerLimit: z.number({ required_error: COMMON_ERROR_TEXT }),
  private: z.boolean().optional(),
  fixtureResultPoints: z.number({ required_error: COMMON_ERROR_TEXT }),
  leagueIds: z.array(z.string({ required_error: COMMON_ERROR_TEXT })),
})
export type CreateBetCompetitionSchema = z.infer<typeof createBetCompetitionSchema>

export const getBetCompetitionsSchema = z.object({
  userId: z.string().optional(),
  isGlobal: z
    .string()
    .optional()
    .transform(val => (val === undefined ? undefined : val === 'true')),
  isPrivate: z
    .string()
    .optional()
    .transform(val => (val === undefined ? undefined : val === 'true')),
})
export type GetBetCompetitionsSchema = z.infer<typeof getBetCompetitionsSchema>

export const getBetCompetitionSchema = z.object({
  id: z.string({ required_error: COMMON_ERROR_TEXT }),
})
export type GetBetCompetitionSchema = z.infer<typeof getBetCompetitionSchema>

export const getBetCompetitionStandingsSchema = z.object({
  betCompetitionId: z.string(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
})

export type GetBetCompetitionStandingsSchema = z.infer<typeof getBetCompetitionStandingsSchema>
