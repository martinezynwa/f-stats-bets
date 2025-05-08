import cors from 'cors'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import { errorHandler } from './lib'
import betsRouter from './routes/bet.routes'
import externalRouter from './routes/external.routes'
import fixturesRouter from './routes/fixture.routes'
import leaguesRouter from './routes/league.routes'
import nationsRouter from './routes/nation.routes'
import seasonsRouter from './routes/season.routes'
import seedRouter from './routes/seed.routes'
import usersRouter from './routes/user.routes'

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
app.use('/external', externalRouter)
app.use('/fixtures', fixturesRouter)
app.use('/leagues', leaguesRouter)
app.use('/nations', nationsRouter)
app.use('/seasons', seasonsRouter)
app.use('/users', usersRouter)
app.use('/seed', seedRouter)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
