import { mockBetsSchema, userBetsSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithBody, validateRequestWithParams } from '../lib'
import { mockBets } from '../services/bet/bet.service.mutations'
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

router.post(
  '/mock',
  validateRequestWithBody(async (req, res) => {
    const bets = await mockBets(req.body)

    res.json(bets)
  }, mockBetsSchema),
)

export default router
