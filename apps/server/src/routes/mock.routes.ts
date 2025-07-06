import { mockBetCompetitionsSchema, mockBetsSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequest, validateRequestWithBody } from '../lib'
import { mockBetCompetitions, mockBets } from '../services/mock/mock.service.mutations'
import { jsonToCsv } from '../lib/json-to-csv'
import { db } from '../db'

const router = Router()

//router.use(requireAuth)

router.post(
  '/bets',
  validateRequestWithBody(async (req, res) => {
    const bets = await mockBets(req.body)

    res.json(bets)
  }, mockBetsSchema),
)

router.post(
  '/bet-competitions',
  validateRequestWithBody(async (req, res) => {
    const betCompetitions = await mockBetCompetitions(req.body)

    res.json(betCompetitions)
  }, mockBetCompetitionsSchema),
)

router.get(
  '/test',
  validateRequest(async (req, res) => {
    const teamTemp = await db.selectFrom('Team').selectAll().execute()

    const order =
      'externalTeamId,season,externalLeagueId,name,code,country,logo,national,venue,createdAt,updatedAt,isForUnassigned'
    const csv = jsonToCsv(teamTemp, order)

    res.json(csv)
  }),
)

export default router
