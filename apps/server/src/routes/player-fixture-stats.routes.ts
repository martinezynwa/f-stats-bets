import { Request, Response, Router } from 'express'
import { validateRequestWithBody } from '../lib'
import { getPlayerFixtureStats } from '../services/player-fixture-stats/player-fixture-stats.service.queries'
import { getPlayerFixtureStatsSchema } from '@f-stats-bets/types'

const router = Router()

//router.use(requireAuth)

router.post(
  '/player-fixture-stats',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const data = await getPlayerFixtureStats(req.body)

    res.json(data)
  }, getPlayerFixtureStatsSchema),
)

export default router
