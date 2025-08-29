import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import { errorHandler } from './lib'
import betCompetitionRouter from './routes/bet-competition.routes'
import betEvaluateRouter from './routes/bet-evaluate.routes'
import betsRouter from './routes/bet.routes'
import externalRouter from './routes/external.routes'
import fixturesRouter from './routes/fixture.routes'
import leaguesRouter from './routes/league.routes'
import mockRouter from './routes/mock.routes'
import nationsRouter from './routes/nation.routes'
import playerFixtureStatsRouter from './routes/player-fixture-stats.routes'
import playerSeasonStatsRouter from './routes/player-season-stats.routes'
import playerRouter from './routes/player.routes'
import seasonsRouter from './routes/season.routes'
import seedRouter from './routes/seed.routes'
import teamsRouter from './routes/team.routes'
import usersRouter from './routes/user.routes'
import jobRouter from './routes/job.routes'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

app.use(express.json())

app.use('/bets', betsRouter)
app.use('/bet-competitions', betCompetitionRouter)
app.use('/bet-evaluate', betEvaluateRouter)
app.use('/external', externalRouter)
app.use('/fixtures', fixturesRouter)
app.use('/leagues', leaguesRouter)
app.use('/nations', nationsRouter)
app.use('/seasons', seasonsRouter)
app.use('/teams', teamsRouter)
app.use('/users', usersRouter)
app.use('/player', playerRouter)
app.use('/seed', seedRouter)
app.use('/mock', mockRouter)
app.use('/player-fixture-stats', playerFixtureStatsRouter)
app.use('/player-season-stats', playerSeasonStatsRouter)
app.use('/jobs', jobRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Server is running on ${process.env.SERVER_URL} ${process.env.MOCK === 'true' ? '| External API service is mocked locally.' : ''}`,
  )
})
