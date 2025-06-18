import { z } from 'zod'

export const evaluateBetsSchema = z.object({
  fixtureIds: z.array(z.number()).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})
export type EvaluateBetsSchema = z.infer<typeof evaluateBetsSchema>

export const getBetsForEvaluationSchema = z
  .object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    fixtureIds: z.array(z.number()).optional(),
  })
  .refine(
    data => {
      const hasDates = data.dateFrom !== undefined || data.dateTo !== undefined
      const hasFixtureIds = data.fixtureIds !== undefined && data.fixtureIds.length > 0

      // Must have either dates or fixtureIds, but not both
      return (hasDates && !hasFixtureIds) || (!hasDates && hasFixtureIds)
    },
    {
      message: 'Must provide either date parameters or fixtureIds, but not both or none',
      path: ['fixtureIds'],
    },
  )
export type GetBetsForEvaluationSchema = z.infer<typeof getBetsForEvaluationSchema>

export const getBetEvaluatedSchema = z.object({
  dateFrom: z.string(),
  dateTo: z.string(),
})
export type GetBetEvaluatedSchema = z.infer<typeof getBetEvaluatedSchema>
