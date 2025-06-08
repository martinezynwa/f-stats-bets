import { teamsValidationSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithBody } from '../lib'
import { getTeams } from '../services/team/team.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequestWithBody(async (req, res) => {
    const seasons = await getTeams(req.body)

    res.json(seasons)
  }, teamsValidationSchema),
)

export default router
