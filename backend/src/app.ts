import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import env from './env'
import morgan from 'morgan'
import assetRoutes from './routes/asset.route'
import createHttpError from 'http-errors'

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

// not found request url error handling
app.all('*', (req, res, next) => {
  next(createHttpError(404, `Can't find ${req.originalUrl} on this server!`))
})

export default app
