import mongoose from 'mongoose'
//delete all the sessions in the database
export async function destroyAllActiveSessionsForUser(userId: string) {
  const regexp = new RegExp('^' + userId)
  mongoose.connection.db.collection('sessions').deleteMany({ _id: regexp })
}
