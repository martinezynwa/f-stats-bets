import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { errorHandler } from './lib'
import betsRouter from './routes/bets'
import usersRouter from './routes/users'

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

app.use('/users', usersRouter)
app.use('/bets', betsRouter)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running: ${process.env.SERVER_URL}`)
})
