import { registerUserSchema } from '@f-stats-bets/types'
import { Request, Response, Router } from 'express'
import { sendNotFound, validateRequest, validateRequestWithBody } from 'src/lib'
import { requireAuth } from 'src/middleware'
import {
  createUser,
  getAllUsers,
  getUserById,
  registerUser,
  removeUser,
  updateUser,
} from 'src/services'

const router = Router()

router.use(requireAuth)

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

router.post(
  '/',
  validateRequest(async (req: Request, res: Response) => {
    const user = await createUser(req.body)
    res.status(201).json(user)
  }),
)

router.put(
  '/:id',
  validateRequest(async (req: Request, res: Response) => {
    const user = await updateUser(req.params.id, req.body)
    if (!user) {
      return sendNotFound(res, 'User not found')
    }
    res.json(user)
  }),
)

router.delete(
  '/:id',
  validateRequest(async (req: Request, res: Response) => {
    const user = await removeUser(req.params.id)
    if (!user) {
      return sendNotFound(res, 'User not found')
    }
    res.json(user)
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
