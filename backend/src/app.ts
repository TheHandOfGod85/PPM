import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import env from './env'
import morgan from 'morgan'
import assetRoutes from './routes/asset.route'
import createHttpError from 'http-errors'
import errorHandler from './middlewares/errorHandler'
import partRoute from './routes/part.route'
import userRoute from './routes/user.route'
import session from 'express-session'
import sessionConfig from './config/session'
import passport from 'passport'
import './config/passport'

const app = express()

console.log('Environment in ' + env.NODE_ENV)

// developement logging
if (env.NODE_ENV === 'production') {
  app.set('trust proxy', true)
  app.use(morgan('combined'))
} else {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use(
  cors({
    origin: env.WEBSITE_URL,
    credentials: true,
  })
)

app.use(session(sessionConfig))
app.use(passport.authenticate('session'))

app.use('/uploads/part-images', express.static('uploads/part-images'))

app.use('/user', userRoute)
app.use('/assets', assetRoutes)
app.use('/part', partRoute)

// not found request url error handling
app.use((req, res, next) => next(createHttpError(404, 'Endpoint not found')))

app.use(errorHandler)

export default app
