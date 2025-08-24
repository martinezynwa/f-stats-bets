import { Router } from 'express'
import { validateRequest } from '../lib'
import { getNations } from '../services/nation/nation.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequest(async (_req, res) => {
    const nations = await getNations()

    res.json(nations)
  }),
)

export default router
