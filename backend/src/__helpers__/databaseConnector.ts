import { Collection, MongoClient, ObjectId, ServerApiVersion } from 'mongodb'

const dbUri = 'mongodb://127.0.0.1:27017/ppmtest'
const dbName = 'ppmtest'

const client = new MongoClient(dbUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export async function connect() {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } catch (error) {
    console.error(error)
  }
}

export async function cleanDatabase() {
  try {
    const db = client.db(dbName)
    await db.dropDatabase()
    console.log(`Dropped the "${dbName}" database.`)
  } catch (error) {
    console.error(error)
  }
}

export async function close() {
  await client.close()
}
