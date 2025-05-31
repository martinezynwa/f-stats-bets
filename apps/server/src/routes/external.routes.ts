import {
  insertFixturesValidationSchema,
  insertLeagueValidationSchema,
  insertTeamValidationSchema,
} from '@f-stats-bets/types'
import { Router } from 'express'
import { db } from '../db'
import { validateRequestWithBody } from '../lib'
import { fetchFixtures } from '../services/external/external.fixture.service'
import { fetchLeagueInfo } from '../services/external/external.league.service'
import { fetchTeamsInfo } from '../services/external/external.team.service'
import { upsertFixtures } from '../services/fixture/fixture.service.mutations'
import { insertLeagueToDb } from '../services/league/league.service.mutations'
import { insertTeamsToDb } from '../services/team/team.service.mutations'
import { fetchFixturesValidationSchema } from './types'
const router = Router()

//router.use(requireAuth)

router.post(
  '/insert-leagues',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season } = req.body

    const leagueData = await fetchLeagueInfo(externalLeagueId, season)

    const added = await insertLeagueToDb({ leagueData, season })

    res.json(added)
  }, insertLeagueValidationSchema),
)

router.post(
  '/insert-teams',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season, leagueId } = req.body

    const teamsData = await fetchTeamsInfo(externalLeagueId, season)

    const added = await insertTeamsToDb({
      leagueId,
      externalLeagueId,
      season,
      teamsData,
    })

    res.json(added)
  }, insertTeamValidationSchema),
)

router.get(
  '/fixtures',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueIds, season, dateFrom, dateTo } = req.body

    const externalFixturesData = await fetchFixtures({
      externalLeagueIds,
      season,
      dateFrom,
      dateTo,
    })

    res.json(externalFixturesData)
  }, fetchFixturesValidationSchema),
)

router.post(
  '/insert-fixtures',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueIds, season, dateFrom, dateTo } = req.body

    await db.deleteFrom('Fixture').execute()
    await db.deleteFrom('FixtureRound').execute()

    const externalFixturesData = await fetchFixtures({
      externalLeagueIds,
      season,
      dateFrom,
      dateTo,
    })

    const fixturesData = await upsertFixtures(externalFixturesData, season)

    res.json(fixturesData)
  }, insertFixturesValidationSchema),
)

export default router
