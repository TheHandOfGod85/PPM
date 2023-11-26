import { SessionOptions } from 'express-session'
import env from '../env'
// import MongoStore from 'connect-mongo'
import crypto from 'crypto'
import RedisStore from 'connect-redis'
import redisClient from './redisClient'

// const store =
//   env.NODE_ENV === 'production'
//     ? new RedisStore({
//         client: redisClient,
//       })
//     : MongoStore.create({
//         mongoUrl: env.MONGO_CONNECTION_STRING,
//       })

const sessionConfig: SessionOptions = {
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  rolling: true,
  store: new RedisStore({
    client: redisClient,
  }),
  // store: MongoStore.create({
  //   mongoUrl: env.MONGO_CONNECTION_STRING,
  // }),
  genid(req) {
    const userId = req.user?._id
    const randomId = crypto.randomUUID()
    if (userId) {
      return `${userId}-${randomId}`
    } else {
      return randomId
    }
  },
}

export default sessionConfig
