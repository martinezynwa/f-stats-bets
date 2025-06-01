import { registerUserSchema } from '@f-stats-bets/types'
import { Request, Response, Router } from 'express'
import { validateRequest, validateRequestWithBody } from '../lib'
import { createUserSettings, registerUser } from '../services/user/user.service.mutations'
import { getAllUsers, getUserById, getUserSettings } from '../services/user/user.service.queries'

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
    const createdUser = await registerUser(req.body)

    await createUserSettings({ userId: createdUser.id, providerId: createdUser.providerId })

    res.json({ text: 'User registered', createdUser })
  }, registerUserSchema),
)

export default router
