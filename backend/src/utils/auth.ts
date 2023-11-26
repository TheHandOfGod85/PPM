// import mongoose from 'mongoose'
import redisClient from '../config/redisClient'

//delete all the sessions in the database
export async function destroyAllActiveSessionsForUser(userId: string) {
  // const regexp = new RegExp('^' + userId)
  // mongoose.connection.db.collection('sessions').deleteMany({ _id: regexp })
  let cursor = 0
  do {
    const result = await redisClient.scan(cursor, {
      MATCH: `sess:${userId}*`,
      COUNT: 1000,
    })
    for (const key of result.keys) {
      await redisClient.del(key)
    }
    cursor = result.cursor
  } while (cursor !== 0)
}
