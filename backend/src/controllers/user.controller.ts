import { RequestHandler } from 'express'
import { SignUpBody } from '../validation/user.validator'
import UserModel from '../models/user'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'

export const signup: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  const { username, email, password: passwordRaw } = req.body
  try {
    const existingUsername = await UserModel.findOne({ username })
      .collation({
        locale: 'en',
        strength: 2,
      })
      .exec()

    if (existingUsername) {
      throw createHttpError(409, 'Username already taken')
    }
    const passwordHashed = await bcrypt.hash(passwordRaw as string, 10)
    const result = await UserModel.create({
      username,
      displayName: username,
      email,
      password: passwordHashed,
    })
    const newUser = result.toObject()
    delete newUser.password
    req.logIn(newUser, (error) => {
      if (error) throw error
      res.status(201).json(newUser)
    })
  } catch (error) {
    next(error)
  }
}
