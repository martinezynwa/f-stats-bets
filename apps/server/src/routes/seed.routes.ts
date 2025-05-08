import { Request, Response, Router } from 'express'
import { z } from 'zod'
import { validateRequest, validateRequestWithBody } from '../lib'
import {
  initDatabase,
  initUsersWithSettings,
  seedDatabaseFromCsv,
  seedDatabaseFromExternalApi,
  seedRelationDataFromCsv,
} from '../services/seed/seed.service.mutations'

export const seedValidationSchema = z.object({
  leagueIds: z.array(z.string()).optional(),
  season: z.number().optional(),
})
export type SeedValidationSchema = z.infer<typeof seedValidationSchema>

export const seedBaseDataValidationSchema = z.object({
  tablesWithRelations: z.array(z.string()).optional(),
  tablesWithoutRelations: z.array(z.string()).optional(),
})
export type SeedBaseDataValidationSchema = z.infer<typeof seedBaseDataValidationSchema>

const router = Router()

//router.use(requireAuth)

router.post(
  '/init-all',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const { tablesWithoutRelations, tablesWithRelations } = req.body

    await initDatabase()
    await initUsersWithSettings()

    if (tablesWithoutRelations && tablesWithoutRelations.length > 0) {
      await seedDatabaseFromCsv(tablesWithoutRelations)
    }

    if (tablesWithRelations && tablesWithRelations.length > 0) {
      await seedRelationDataFromCsv(tablesWithRelations)
    }

    res.json({ text: 'Database initialized' })
  }, seedBaseDataValidationSchema),
)

router.post(
  '/init-database',
  validateRequest(async (req: Request, res: Response) => {
    await initDatabase()

    res.json({ text: 'Database initialized' })
  }),
)

router.post(
  '/init-users',
  validateRequest(async (req: Request, res: Response) => {
    const data = await initUsersWithSettings()

    res.json({ text: 'Users initialized', data })
  }),
)

router.post(
  '/seed-from-csv',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const { tablesWithoutRelations, tablesWithRelations } = req.body

    if (tablesWithoutRelations && tablesWithoutRelations.length > 0) {
      await seedDatabaseFromCsv(tablesWithoutRelations)
    }

    if (tablesWithRelations && tablesWithRelations.length > 0) {
      await seedRelationDataFromCsv(tablesWithRelations)
    }

    res.json({ text: 'Database seeded from CSV files' })
  }, seedBaseDataValidationSchema),
)

router.post(
  '/seed-from-external-api',
  validateRequestWithBody(async (req: Request, res: Response) => {
    //TODO implementation
    await seedDatabaseFromExternalApi(req.body.tablesWithoutRelations)

    res.json({ text: 'Database seeded from external API' })
  }, seedBaseDataValidationSchema),
)

export default router
