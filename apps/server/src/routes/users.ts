import { Request, Response, Router } from 'express'
import { sendNotFound, validateRequest } from 'src/lib'
import { requireAuth } from 'src/middleware'
import { createUser, getAllUsers, getUserById, removeUser, updateUser } from 'src/services'

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
    if (!user) {
      return sendNotFound(res, 'User not found')
    }
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

export default router
