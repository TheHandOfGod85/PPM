import { RequestHandler } from 'express'
import { SignUpBody } from '../validation/user.validator'
import UserModel from '../models/user'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'
import assertIsDefined from '../utils/assertDefined'
import 'express-async-errors'

export const getAuthenticatedUser: RequestHandler = async (req, res) => {
  const authenticatedUser = req.user
  assertIsDefined(authenticatedUser)
  const user = await UserModel.findById(authenticatedUser._id)
    .select('+email')
    .exec()
  res.status(200).json(user)
}

export const getUsersHandler: RequestHandler = async (req, res) => {
  const users = await UserModel.find().select('+email').exec()
  res.status(200).json(users)
}

export const signup: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res) => {
  const { username, email, password: passwordRaw, role } = req.body
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
    role,
  })
  const newUser = result.toObject()
  delete newUser.password
  // req.logIn(newUser, (error) => {
  //   if (error) throw error
  //   res.status(201).json(newUser)
  // })
  res.status(201).json(newUser)
}

export const logOut: RequestHandler = (req, res) => {
  req.logOut((error) => {
    if (error) throw error
    res.sendStatus(200)
  })
}
