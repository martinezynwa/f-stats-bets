import {
  createPlayerFromFixturesValidationSchema,
  createPlayerToTeamValidationSchema,
} from '@f-stats-bets/types'
import { Router } from 'express'
import { validateRequestWithBody } from '../lib'
import {
  addNewPlayers,
  createPlayersFromFixtures,
  createPlayerToTeamFromFixtures,
} from '../services/player/player.service.mutations'

const router = Router()

//router.use(requireAuth)

router.post(
  '/create-players-fully',
  validateRequestWithBody(async (req, res) => {
    const data = await addNewPlayers(req.body)

    res.json(data)
  }, createPlayerToTeamValidationSchema),
)

router.post(
  '/create-player-profile',
  validateRequestWithBody(async (req, res) => {
    const data = await createPlayersFromFixtures(req.body)

    res.json(data)
  }, createPlayerFromFixturesValidationSchema),
)

router.post(
  '/create-player-to-team',
  validateRequestWithBody(async (req, res) => {
    const data = await createPlayerToTeamFromFixtures(req.body)

    res.json(data)
  }, createPlayerToTeamValidationSchema),
)

export default router
