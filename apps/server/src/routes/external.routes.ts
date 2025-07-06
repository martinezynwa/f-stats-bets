import {
  insertFixturesValidationSchema,
  insertLeagueValidationSchema,
  insertTeamValidationSchema,
  initSupportedLeaguesValidationSchema,
  initLeaguesValidationSchema,
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
import { initLeagues } from '../services/external/external.service'
import { getSupportedLeagues } from '../assets/league-data'
const router = Router()

//router.use(requireAuth)

router.post(
  '/init-leagues',
  validateRequestWithBody(async (req, res) => {
    const added = await initLeagues(req.body)

    res.json(added)
  }, initLeaguesValidationSchema),
)

router.post(
  '/init-supported-leagues',
  validateRequestWithBody(async (req, res) => {
    const { season } = req.body

    const leagues = getSupportedLeagues(season)
    const added = await initLeagues({ externalLeagueIds: leagues.map(league => league.id), season })

    res.json(added)
  }, initSupportedLeaguesValidationSchema),
)

router.get(
  '/leagues',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season } = req.body

    const leagueData = await fetchLeagueInfo(externalLeagueId, season)

    res.json(leagueData)
  }, insertLeagueValidationSchema),
)

router.post(
  '/insert-league',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season } = req.body

    const leagueData = await fetchLeagueInfo(externalLeagueId, season)

    const added = await insertLeagueToDb({ leagueData, season })

    res.json(added)
  }, insertLeagueValidationSchema),
)

router.get(
  '/teams',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season } = req.body

    const teamsData = await fetchTeamsInfo(externalLeagueId, season)

    res.json(teamsData)
  }, insertTeamValidationSchema),
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
