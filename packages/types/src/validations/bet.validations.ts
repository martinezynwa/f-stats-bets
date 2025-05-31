import { z } from 'zod'

export const userBetsSchema = z.object({
  userId: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
})

export type UserBetsSchema = z.infer<typeof userBetsSchema>
