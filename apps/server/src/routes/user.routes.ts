import { registerUserSchema } from '@f-stats-bets/types'
import { Request, Response, Router } from 'express'
import { validateRequest, validateRequestWithBody } from 'src/lib'
import {
  getAllUsers,
  getUserById,
  getUserSettings,
  registerUser,
} from '../services/user/user.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/',
  validateRequest(async (req: Request, res: Response) => {
    const users = await getAllUsers()
    res.json(users)
  }),
)

router.get(
  '/:id',
  validateRequest(async (req: Request, res: Response) => {
    const user = await getUserById(req.params.id)

    res.json(user)
  }),
)

router.get(
  '/settings/:id',
  validateRequest(async (req: Request, res: Response) => {
    const userSettings = await getUserSettings(req.params.id)

    res.json(userSettings)
  }),
)

router.post(
  '/register-user',
  validateRequestWithBody(async (req: Request, res: Response) => {
    await registerUser(req.body)

    res.json({ text: 'User registered' })
  }, registerUserSchema),
)

export default router
