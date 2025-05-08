import { fixturesBetsSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithParams } from 'src/lib'
import { getFixturesWithBets } from '../services/fixture/fixture.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/fixtures-bets',
  validateRequestWithParams(async (req, res) => {
    const fixturesWithBets = await getFixturesWithBets(req.query)

    res.json(fixturesWithBets)
  }, fixturesBetsSchema),
)

export default router
