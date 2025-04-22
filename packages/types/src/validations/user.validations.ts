import { z } from 'zod'

export const registerUserSchema = z.object({
  name: z.string(),
  providerId: z.string(),
  providerName: z.string(),
  providerAvatar: z.string(),
})

export type RegisterUserInput = z.infer<typeof registerUserSchema>
