import { createClient } from 'redis'

const redisClient = createClient()
redisClient.connect().catch((error) => console.error(error))
export default redisClient
