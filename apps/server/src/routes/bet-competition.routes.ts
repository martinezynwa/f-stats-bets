import {
  createBetCompetitionSchema,
  getBetCompetitionsSchema,
  getBetCompetitionStandingsSchema,
  getUserNamesOfBetCompetitionSchema,
} from '@f-stats-bets/types'
import { Router } from 'express'
import { requireAuth } from 'src/middleware'
import { validateRequest, validateRequestWithBody, validateRequestWithParams } from '../lib'
import {
  createBetCompetition,
  createBetCompetitionToLeague,
  createUserToBetCompetition,
} from '../services/bet-competition/bet-competition.service.mutations'
import {
  getBetCompetition,
  getBetCompetitions,
  getBetCompetitionStandings,
  getJoinedBetCompetitions,
  getUserNamesOfBetCompetition,
} from '../services/bet-competition/bet-competition.service.queries'
import { getGlobalBetCompetitionId } from '../services/bet/bet.service.queries'

const router = Router()

//router.use(requireAuth)

router.get(
  '/global',
  validateRequest(async (_, res) => {
    const globalBetCompetitionId = await getGlobalBetCompetitionId()

    res.json(globalBetCompetitionId)
  }),
)

router.get(
  '/',
  validateRequestWithParams(async (req, res) => {
    const userId = req.query.userId || req.user?.id!

    const betCompetitions = await getBetCompetitions({ ...req.query, userId })

    res.json(betCompetitions)
  }, getBetCompetitionsSchema),
)

router.get(
  '/joined',
  validateRequestWithParams(async (req, res) => {
    const userId = req.query.userId || req.user?.id!

    const betCompetitions = await getJoinedBetCompetitions(userId)

    res.json(betCompetitions)
  }, getBetCompetitionsSchema),
)

router.get(
  '/standings',
  validateRequestWithParams(async (req, res) => {
    const data = await getBetCompetitionStandings(req.query)

    res.json(data)
  }, getBetCompetitionStandingsSchema),
)

router.get(
  '/:id',
  validateRequest(async (req, res) => {
    const betCompetition = await getBetCompetition(req.params.id)

    res.json(betCompetition)
  }),
)

router.get(
  '/:id/users',
  validateRequest(async (req, res) => {
    const users = await getUserNamesOfBetCompetition(req.params.id)

    res.json(users)
  }),
)

router.post(
  '/',
  validateRequestWithBody(async (req, res) => {
    const { leagueIds, ...data } = req.body

    const createdBetCompetition = await createBetCompetition({ ...data, userId: req.user?.id! })

    await createBetCompetitionToLeague(createdBetCompetition.betCompetitionId, leagueIds)

    await createUserToBetCompetition(createdBetCompetition.betCompetitionId, [req.user?.id!])

    res.json(createdBetCompetition)
  }, createBetCompetitionSchema),
)

export default router
