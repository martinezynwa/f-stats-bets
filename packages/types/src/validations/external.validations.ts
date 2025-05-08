import { z } from 'zod'
import { FederationType } from '../generated.types'

export const insertLeagueValidationSchema = z.object({
  externalLeagueId: z.string(),
  season: z.number(),
  isNational: z.boolean(),
  isSupported: z.boolean(),
  federation: z.nativeEnum(FederationType),
})

export const insertTeamValidationSchema = z.object({
  leagueId: z.string(),
  externalLeagueId: z.string(),
  season: z.number(),
})
