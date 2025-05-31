import { userBetsSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithParams } from '../lib'
import { getUserBets } from '../services/bet/bet.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequestWithParams(async (req, res) => {
    const bets = await getUserBets(req.query)

    res.json(bets)
  }, userBetsSchema),
)

export default router
