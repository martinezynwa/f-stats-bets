import { Router } from 'express'
import { validateRequest } from '../lib'
import { getLeagues } from '../services/league/league.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequest(async (_req, res) => {
    const leagues = await getLeagues()

    res.json(leagues)
  }),
)

export default router
