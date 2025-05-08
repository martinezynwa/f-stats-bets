import { createBetSchema, updateBetSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { sendNotFound, validateRequest, validateRequestWithBody } from 'src/lib'
import { requireAuth } from 'src/middleware'
import {
  createBet,
  getAllBets,
  getBetById,
  removeBet,
  updateBet,
} from '../services/bet/bet.service.queries'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  validateRequest(async (_req, res) => {
    const bets = await getAllBets()
    res.json(bets)
  }),
)

router.get(
  '/:id',
  validateRequest(async (req, res) => {
    const bet = await getBetById(req.params.id)

    if (!bet) {
      return sendNotFound(res, 'Bet not found')
    }

    res.json(bet)
  }),
)

router.post(
  '/',
  validateRequestWithBody(async (req, res) => {
    const bet = await createBet(req.body)

    res.status(201).json(bet)
  }, createBetSchema),
)

router.put(
  '/:id',
  validateRequestWithBody(async (req, res) => {
    const bet = await updateBet(req.body)

    if (!bet) {
      return sendNotFound(res, 'Bet not found')
    }

    res.json(bet)
  }, updateBetSchema),
)

router.delete(
  '/:id',
  validateRequest(async (req, res) => {
    const bet = await removeBet(req.params.id)

    if (!bet) {
      return sendNotFound(res, 'Bet not found')
    }

    res.json(bet)
  }),
)

export default router
