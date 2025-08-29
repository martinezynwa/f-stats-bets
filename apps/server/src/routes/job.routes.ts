import { Router } from 'express'
import { validateRequest, validateRequestWithBody } from '../lib'
import { dailyDataUpdate, regularDataUpdate } from '../services/job/job.service'
import { requireJobAuth } from '../middleware'
import { regularDataUpdateSchema } from '@f-stats-bets/types'

const router = Router()

router.use(requireJobAuth)

router.get(
  '/daily-data-update',
  validateRequest(async (_, res) => {
    const data = await dailyDataUpdate()

    res.json(data)
  }),
)

router.get(
  '/regular-data-update',
  validateRequest(async (_, res) => {
    const data = await regularDataUpdate()

    res.json(data)
  }),
)

router.post(
  '/regular-data-update',
  validateRequestWithBody(async (req, res) => {
    const data = await regularDataUpdate(req.body)

    res.json(data)
  }, regularDataUpdateSchema),
)

export default router
