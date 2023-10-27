import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import env from './env'
import morgan from 'morgan'

const app = express()

app.use(express.json())

app.use(morgan('dev'))

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
)

app.get('/', (req, res) => {
  res.send('Hello pucchiacca bella')
})

export default app
