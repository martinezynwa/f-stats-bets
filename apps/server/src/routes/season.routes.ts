import { Router } from 'express'
import { z } from 'zod'
import { validateRequest, validateRequestWithBody } from '../lib'
import { createSeason } from '../services/season/season.service.mutations'
import { getSeasons } from '../services/season/season.service.queries'
export const createSeasonValidationSchema = z.object({
  season: z.number(),
  seasonStartDate: z.string(),
  seasonEndDate: z.string(),
  supportedLeagues: z.array(z.string()),
  isActual: z.boolean(),
  isSupported: z.boolean(),
})
export type CreateSeasonValidationSchema = z.infer<typeof createSeasonValidationSchema>

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequest(async (_req, res) => {
    const seasons = await getSeasons({})

    res.json(seasons)
  }),
)

router.get(
  '/supported',
  validateRequest(async (_req, res) => {
    const seasons = await getSeasons({ supported: true })

    res.json(seasons)
  }),
)

router.post(
  '/',
  validateRequestWithBody(async (req, res) => {
    const seasons = await createSeason(req.body)

    res.json(seasons)
  }, createSeasonValidationSchema),
)

export default router
