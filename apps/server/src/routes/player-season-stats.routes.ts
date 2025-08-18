import { Request, Response, Router } from 'express'
import { validateRequestWithBody } from '../lib'
import { getPlayerSeasonStats } from '../services/player-season-stats/player-season-stats.service.queries'
import {
  getPlayerSeasonStatsSchema,
  insertPlayerSeasonStatsValidationSchema,
} from '@f-stats-bets/types'
import { createAndInsertPlayerSeasonStats } from '../services/player-season-stats/player-season-stats.service.mutations'
import { getFixtureIds } from 'src/services/fixture/fixture.service.queries'

const router = Router()

//router.use(requireAuth)

router.post(
  '/player-season-stats',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const data = await getPlayerSeasonStats(req.body)

    res.json(data)
  }, getPlayerSeasonStatsSchema),
)

router.post(
  '/create-player-season-stats',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const fixtureIds = await getFixtureIds(req.body)

    const created = await createAndInsertPlayerSeasonStats(fixtureIds)

    res.json(created)
  }, insertPlayerSeasonStatsValidationSchema),
)

export default router
