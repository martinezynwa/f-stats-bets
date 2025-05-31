import { fixturesBetsSchema, fixturesSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithBody, validateRequestWithParams } from '../lib'
import { getFixtures, getFixturesWithBets } from '../services/fixture/fixture.service.queries'

const router = Router()

//router.use(requireAuth)

router.post(
  '/',
  validateRequestWithBody(async (req, res) => {
    const fixtures = await getFixtures(req.body)

    res.json(fixtures)
  }, fixturesSchema),
)

router.get(
  '/fixtures-bets',
  validateRequestWithParams(async (req, res) => {
    const fixturesWithBets = await getFixturesWithBets(req.query)

    res.json(fixturesWithBets)
  }, fixturesBetsSchema),
)

export default router
