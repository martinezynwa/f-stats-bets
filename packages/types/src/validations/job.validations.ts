import { z } from 'zod'

export const dailyDataUpdateSchema = z.object({
  season: z.number().optional(),
})
export type DailyDataUpdateSchema = z.infer<typeof dailyDataUpdateSchema>

export const regularDataUpdateSchema = z.object({
  season: z.number(),
  selectedDate: z.string().optional(),
})
export type RegularDataUpdateSchema = z.infer<typeof regularDataUpdateSchema>
