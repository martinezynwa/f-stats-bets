import {
  insertFixturesValidationSchema,
  insertLeagueValidationSchema,
  insertTeamValidationSchema,
  initSupportedLeaguesValidationSchema,
  initLeaguesValidationSchema,
  insertPlayersValidationSchema,
  fetchPlayersProfilesValidationSchema,
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
import {
  fetchPlayersProfiles,
  fetchPlayersSquads,
} from '../services/external/external.player.service'
import { fetchAndInsertPlayers } from '../services/player/player.service.mutations'

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
    const added = await initLeagues({ leagueIds: leagues.map(league => league.id), season })

    res.json(added)
  }, initSupportedLeaguesValidationSchema),
)

router.get(
  '/leagues',
  validateRequestWithBody(async (req, res) => {
    const { leagueId, season } = req.body

    const leagueData = await fetchLeagueInfo(leagueId, season)

    res.json(leagueData)
  }, insertLeagueValidationSchema),
)

router.post(
  '/insert-league',
  validateRequestWithBody(async (req, res) => {
    const { leagueId, season } = req.body

    const leagueData = await fetchLeagueInfo(leagueId, season)

    const added = await insertLeagueToDb({ leagueData, season })

    res.json(added)
  }, insertLeagueValidationSchema),
)

router.post(
  '/teams',
  validateRequestWithBody(async (req, res) => {
    const { leagueId, season } = req.body

    const teamsData = await fetchTeamsInfo(leagueId, season)

    res.json(teamsData)
  }, insertTeamValidationSchema),
)

router.post(
  '/insert-teams',
  validateRequestWithBody(async (req, res) => {
    const { leagueId, season } = req.body

    const teamsData = await fetchTeamsInfo(leagueId, season)

    const added = await insertTeamsToDb({
      leagueId,
      season,
      teamsData,
    })

    res.json(added)
  }, insertTeamValidationSchema),
)

router.post(
  '/fixtures',
  validateRequestWithBody(async (req, res) => {
    const { leagueIds, season, dateFrom, dateTo } = req.body

    const externalFixturesData = await fetchFixtures({
      leagueIds,
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
    const { leagueIds, season, dateFrom, dateTo } = req.body

    await db.deleteFrom('Fixture').execute()
    await db.deleteFrom('FixtureRound').execute()

    const externalFixturesData = await fetchFixtures({
      leagueIds,
      season,
      dateFrom,
      dateTo,
    })

    const fixturesData = await upsertFixtures(externalFixturesData, season)

    res.json(fixturesData)
  }, insertFixturesValidationSchema),
)

router.post(
  '/players-squads',
  validateRequestWithBody(async (req, res) => {
    const teamsData = await fetchPlayersSquads(req.body)

    res.json(teamsData)
  }, insertPlayersValidationSchema),
)

router.post(
  '/player-profiles',
  validateRequestWithBody(async (req, res) => {
    const playersData = await fetchPlayersProfiles(req.body.playerIds)

    res.json(playersData)
  }, fetchPlayersProfilesValidationSchema),
)
router.post(
  '/insert-players',
  validateRequestWithBody(async (req, res) => {
    const playersData = await fetchAndInsertPlayers(req.body)

    res.json(playersData)
  }, insertPlayersValidationSchema),
)

export default router
