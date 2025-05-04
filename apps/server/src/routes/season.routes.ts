import { Router } from 'express'
import { validateRequest } from 'src/lib'
import { getSeasons } from 'src/services/season/season.service.queries'

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

export default router
