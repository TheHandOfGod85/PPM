import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import env from './env'
import morgan from 'morgan'
import assetRoutes from './routes/asset.route'

const app = express()

app.use(express.json())

app.use(morgan('dev'))

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
)

app.use('/assets', assetRoutes)

export default app
