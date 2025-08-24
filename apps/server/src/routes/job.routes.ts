import { Router } from 'express'
import { validateRequest } from '../lib'
import { dailyDataUpdate, regularDataUpdate } from '../services/job/job.service'
import { requireJobAuth } from '../middleware'

const router = Router()

router.use(requireJobAuth)

router.get(
  '/daily-data-update',
  validateRequest(async (req, res) => {
    const data = await dailyDataUpdate()

    res.json(data)
  }),
)

router.get(
  '/regular-data-update',
  validateRequest(async (req, res) => {
    const data = await regularDataUpdate()

    res.json(data)
  }),
)

export default router
