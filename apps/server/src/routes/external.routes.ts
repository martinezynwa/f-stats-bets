import { insertLeagueValidationSchema, insertTeamValidationSchema } from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithBody } from '../lib'
import { fetchLeagueInfo } from '../services/external/external.league.service'
import { fetchTeamsInfo } from '../services/external/external.team.service'
import { insertLeagueToDb } from '../services/league/league.service.mutations'
import { insertTeamsToDb } from '../services/team/team.service.mutations'
const router = Router()

//router.use(requireAuth)

router.post(
  '/leagues',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season } = req.body

    const leagueData = await fetchLeagueInfo(externalLeagueId, season)

    const added = await insertLeagueToDb({ leagueData, season })

    res.json(added)
  }, insertLeagueValidationSchema),
)

router.post(
  '/teams',
  validateRequestWithBody(async (req, res) => {
    const { externalLeagueId, season, leagueId } = req.body

    const leagueData = await fetchTeamsInfo(externalLeagueId, season)

    const added = await insertTeamsToDb({
      leagueId,
      externalLeagueId,
      season,
      teamsData: leagueData,
    })

    res.json(added)
  }, insertTeamValidationSchema),
)

export default router
