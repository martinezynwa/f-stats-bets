import {
  seedAllTablesValidationSchema,
  seedSpecificTablesValidationSchema,
  seedFromExternalApiValidationSchema,
} from '@f-stats-bets/types'
import { Request, Response, Router } from 'express'
import { fetchFixtures } from 'src/services/external/external.fixture.service'
import { upsertFixtures } from 'src/services/fixture/fixture.service.mutations'
import { mockBetData } from 'src/services/mock/mock.service.mutations'
import { validateRequest, validateRequestWithBody } from '../lib'
import {
  initDatabase,
  initUsersWithSettings,
  seedDatabaseFromCsv,
  seedDatabaseFromExternalApi,
  seedRelationDataFromCsv,
} from '../services/seed/seed.service.mutations'
import { TableWithoutRelations, TableWithRelations } from 'src/services/seed/seed.service.types'
const router = Router()

//router.use(requireAuth)

router.post(
  '/init-all-tables-from-csv',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const { shouldMockBetData, seasons, fixtureExternalLeagueIds, fixtureDateFrom, fixtureDateTo } =
      req.body

    const tablesWithoutRelations: TableWithoutRelations[] = ['Season', 'League', 'Nation']
    const tablesWithRelations: TableWithRelations[] = ['Team']

    const fixturesIncludedInSeed =
      seasons && fixtureExternalLeagueIds && fixtureDateFrom && fixtureDateTo

    await initDatabase()
    const userData = await initUsersWithSettings()
    await seedDatabaseFromCsv(tablesWithoutRelations)
    await seedRelationDataFromCsv(tablesWithRelations)

    if (fixturesIncludedInSeed) {
      for (const season of seasons) {
        const externalFixturesData = await fetchFixtures({
          leagueIds: fixtureExternalLeagueIds,
          season,
          dateFrom: fixtureDateFrom,
          dateTo: fixtureDateTo,
        })

        await upsertFixtures(externalFixturesData, season)
      }

      if (shouldMockBetData) {
        await mockBetData({
          ...req.body,
          userIds: userData.parsedUserData.map(user => user.providerId),
        })
      }
    }

    const responseText =
      `Database initialized ${fixturesIncludedInSeed ? '| Fixtures added' : ''} ${
        shouldMockBetData ? '| Custom data mocked' : ''
      }`.trim()

    res.json({ responseText })
  }, seedAllTablesValidationSchema),
)

router.post(
  '/init-specific-tables-from-csv',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const { tablesWithoutRelations, tablesWithRelations } = req.body

    if (tablesWithoutRelations.length > 0) {
      await seedDatabaseFromCsv(tablesWithoutRelations)
    }

    if (tablesWithRelations.length > 0) {
      await seedRelationDataFromCsv(tablesWithRelations)
    }

    res.json({ text: 'Database seeded from CSV files' })
  }, seedSpecificTablesValidationSchema),
)

router.post(
  '/init-all-from-external-api',
  validateRequestWithBody(async (req: Request, res: Response) => {
    const { shouldIgnoreBaseData } = req.body

    if (!shouldIgnoreBaseData) {
      await initDatabase()
      await initUsersWithSettings()
      await seedDatabaseFromCsv(['Season', 'Nation'])
    }

    await seedDatabaseFromExternalApi(req.body)

    res.json({ text: 'Database seeded from external API' })
  }, seedFromExternalApiValidationSchema),
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

export default router
