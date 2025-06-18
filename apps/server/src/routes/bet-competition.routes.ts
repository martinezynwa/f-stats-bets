import { Router } from 'express'
import { validateRequest } from '../lib'
import { getGlobalBetCompetitionId } from '../services/bet/bet.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/global',
  validateRequest(async (req, res) => {
    const globalBetCompetitionId = await getGlobalBetCompetitionId()

    res.json(globalBetCompetitionId)
  }),
)

export default router
