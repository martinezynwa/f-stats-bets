import { createBetSchema, updateBetSchema, userBetsFromFixtureIdsSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { requireAuth } from 'src/middleware'
import { validateRequest, validateRequestWithBody, validateRequestWithParams } from '../lib'
import { createBet, deleteBet, updateBet } from '../services/bet/bet.service.mutations'
import { getUserBetsFromFixtureIds } from '../services/bet/bet.service.queries'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  validateRequestWithParams(async (req, res) => {
    const bets = await getUserBetsFromFixtureIds(req.query)

    res.json(bets)
  }, userBetsFromFixtureIdsSchema),
)

router.post(
  '/',
  validateRequestWithBody(async (req, res) => {
    const bet = await createBet({ ...req.body, userId: req.user?.id! })

    res.json(bet)
  }, createBetSchema),
)

router.put(
  '/:id',
  validateRequestWithBody(async (req, res) => {
    const bet = await updateBet({ ...req.body, betId: req.params.id })

    res.json(bet)
  }, updateBetSchema),
)

router.delete(
  '/:id',
  validateRequest(async (req, res) => {
    const bet = await deleteBet({ betId: req.params.id })

    res.json(bet)
  }),
)

export default router
