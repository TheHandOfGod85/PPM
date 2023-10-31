import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import env from './env'
import morgan from 'morgan'
import assetRoutes from './routes/asset.route'
import createHttpError from 'http-errors'
import errorHandler from './middlewares/errorHandler'
import partRoute from './routes/part.route'

const app = express()

app.use(express.json())

app.use(morgan('dev'))

app.use(
  cors({
    origin: env.WEBSITE_URL,
  })
)

// developement logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

console.log('Environment in ' + env.NODE_ENV)

app.use('/assets', assetRoutes)
app.use('/part', partRoute)

// not found request url error handling
app.use((req, res, next) => next(createHttpError(404, 'Endpoint not found')))

app.use(errorHandler)

export default app
