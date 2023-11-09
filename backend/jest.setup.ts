// jest.setTimeout(5000);
import { MongoMemoryServer } from 'mongodb-memory-server'

module.exports = async () => {
  process.env.MONGO_CONNECTION_STRING = (
    await MongoMemoryServer.create()
  ).getUri()
}
