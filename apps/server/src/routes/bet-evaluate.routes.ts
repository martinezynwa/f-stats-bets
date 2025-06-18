import { evaluateBetsSchema, getBetEvaluatedSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithBody, validateRequestWithParams } from '../lib'
import { getBetsEvaluated } from '../services/bet-evaluate/bet-evaluate.service.queries'
import { evaluateBets } from '../services/bet-evaluate/bet-evalute.service.mutations'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequestWithParams(async (req, res) => {
    const result = await getBetsEvaluated(req.query)

    res.json(result)
  }, getBetEvaluatedSchema),
)

router.post(
  '/evaluate',
  validateRequestWithBody(async (req, res) => {
    const result = await evaluateBets(req.body)

    res.json(result)
  }, evaluateBetsSchema),
)

export default router
