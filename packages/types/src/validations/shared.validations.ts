import { z } from 'zod'

export const datePeriodSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const queryProps = z.object({
  sort: z.enum(['asc', 'desc']).optional(),
  orderBy: z.string().optional(),
})
export type QueryProps = z.infer<typeof queryProps>

export const paginationProps = z.object({
  cursor: z.string().optional(),
  take: z.string().optional(),
})
export type PaginationProps = z.infer<typeof paginationProps>

export const paginatedResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    items: z.array(schema),
    nextCursor: z.string().nullable(),
    count: z.number(),
  })
