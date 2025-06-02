import { userBetsFromFixtureIdsSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithParams } from '../lib'
import { getUserBetsFromFixtureIds } from '../services/bet/bet.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequestWithParams(async (req, res) => {
    const bets = await getUserBetsFromFixtureIds(req.query)

    res.json(bets)
  }, userBetsFromFixtureIdsSchema),
)

export default router
