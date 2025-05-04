import { z } from 'zod'

export const datePeriodSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const paginationSchema = z.object({
  cursor: z.string().nullish().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
})
