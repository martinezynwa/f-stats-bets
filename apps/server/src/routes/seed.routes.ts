import { Request, Response, Router } from 'express'
import { validateRequest, validateRequestWithBody } from 'src/lib'
import { z } from 'zod'
import { initDatabase, seedBaseData } from '../services/seed/seed.service.mutations'

export const seedValidationSchema = z.object({
  leagueIds: z.array(z.string()).optional(),
  season: z.number().optional(),
})
export type SeedValidationSchema = z.infer<typeof seedValidationSchema>

export const seedBaseDataValidationSchema = z.object({
  tableNames: z.array(z.string()),
})
export type SeedBaseDataValidationSchema = z.infer<typeof seedBaseDataValidationSchema>

const router = Router()

//router.use(requireAuth)

router.post(
  '/init',
  validateRequest(async (req: Request, res: Response) => {
    await initDatabase()

    res.json({ text: 'Database initialized' })
  }),
)

router.post(
  '/seed-base-data',
  validateRequestWithBody(async (req: Request, res: Response) => {
    await seedBaseData(req.body.tableNames)

    res.json({ text: 'Base data seeded' })
  }, seedBaseDataValidationSchema),
)

export default router
