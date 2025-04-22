import { z } from 'zod'

export const createBetSchema = z.object({
  name: z.string().min(1),
})

export type CreateBetSchema = z.infer<typeof createBetSchema>

export const updateBetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
})

export type UpdateBetSchema = z.infer<typeof updateBetSchema>
