import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import UserModel from '../models/user'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

passport.serializeUser((user, cb) => {
  cb(null, { _id: user._id, role: user.role })
})

passport.deserializeUser((user: Express.User, cb) => {
  cb(null, { _id: new mongoose.Types.ObjectId(user._id), role: user.role })
})

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const existingUser = await UserModel.findOne({ username })
        .select('+email +password')
        .exec()
      if (!existingUser || !existingUser.password) {
        return cb(null, false)
      }
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      )
      if (!passwordMatch) {
        return cb(null, false)
      }
      const user = existingUser.toObject()
      delete user.password
      return cb(null, user)
    } catch (error) {
      cb(error)
    }
  })
)
