import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { RequestHandler } from 'express'
import createHttpError from 'http-errors'
import PasswordResetToken from '../models/password-reset-token'
import TokenModel from '../models/token'
import UserModel from '../models/user'
import assertIsDefined from '../utils/assertDefined'
import { destroyAllActiveSessionsForUser } from '../utils/auth'
import { sendPasswordResetCode, sendVerificationCode } from '../utils/email'
import {
  RemoveUserParams,
  RequestResetPasswordBody,
  ResetPasswordBody,
  SendRegistrationBody,
  SignUpBody,
  UpdateUserBody,
} from '../validation/user.validator'

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const authenticatedUser = req.user
    assertIsDefined(authenticatedUser)
    const user = await UserModel.findById(authenticatedUser._id)
      .select('+email')
      .exec()
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

export const getUsersHandler: RequestHandler = async (req, res, next) => {
  try {
    const users = await UserModel.find()
      .select('+email')
      .populate({
        path: 'token',
        select: ['createdAt'],
      })
      .exec()
    res.status(200).json(users)
  } catch (error) {
    next(error)
  }
}

export const sendRegistration: RequestHandler<
  unknown,
  unknown,
  SendRegistrationBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, role } = req.body

    const user = await UserModel.findOne({ email })
    if (user) {
      const token = await TokenModel.findOne({ userId: user._id })
      if (token) {
        token.deleteOne()
      }
      const tokenModel = await TokenModel.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      })
      await sendVerificationCode(user._id.toString(), email, tokenModel.token)
      res.status(200).json(`An email was sent to ${email}`)
    } else {
      const createdUser = await UserModel.create({
        email,
        role,
      })
      const tokenModel = await TokenModel.create({
        userId: createdUser._id,
        token: crypto.randomBytes(32).toString('hex'),
      })
      await sendVerificationCode(
        createdUser._id.toString(),
        createdUser.email,
        tokenModel.token
      )
      res.status(200).json(`An email was sent to ${email}`)
    }
  } catch (error) {
    next(error)
  }
}

export const signup: RequestHandler<
  unknown,
  unknown,
  SignUpBody,
  unknown
> = async (req, res, next) => {
  try {
    const {
      username,
      password: passwordRaw,
      about,
      displayName,
      verificationCode,
      userId,
    } = req.body

    const verifiedCode = await TokenModel.findOne({
      token: verificationCode,
    }).exec()
    if (!verifiedCode) {
      throw createHttpError(400, 'Verification code incorrect or expired.')
    } else {
      await verifiedCode.deleteOne()
    }

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
    const user = await UserModel.findOne({ _id: userId })
    if (!user) {
      throw createHttpError(400, 'Invalid link.')
    }
    const result = await UserModel.findByIdAndUpdate(user._id, {
      $set: {
        username,
        password: passwordHashed,
        about,
        displayName,
        verified: true,
      },
    })
    assertIsDefined(result)
    const newUser = result.toObject()
    delete newUser.password
    req.logIn(newUser, (error) => {
      if (error) throw error
      res.status(201).json(newUser)
    })
    // res.status(201).json(newUser)
  } catch (error) {
    next(error)
  }
}

export const logOut: RequestHandler = (req, res, next) => {
  try {
    req.logOut((error) => {
      if (error) throw error
      res.sendStatus(200)
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserHandler: RequestHandler<
  unknown,
  unknown,
  UpdateUserBody,
  unknown
> = async (req, res, next) => {
  try {
    const { username, displayName, about } = req.body
    const authenticatedUser = req.user?._id
    assertIsDefined(authenticatedUser)
    if (username) {
      const existingUsername = await UserModel.findOne({ username })
        .collation({
          locale: 'en',
          strength: 2,
        })
        .exec()

      if (existingUsername) {
        throw createHttpError(409, 'Username already taken')
      }
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      authenticatedUser,
      {
        $set: {
          ...(username && { username }),
          ...(about && { about }),
          ...(displayName && { displayName }),
        },
      },
      { new: true }
    ).exec()

    res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const requestResetPasswordCode: RequestHandler<
  unknown,
  unknown,
  RequestResetPasswordBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await UserModel.findOne({ email })
      .collation({
        locale: 'en',
        strength: 2,
      })
      .exec()
    if (!user) {
      throw createHttpError(404, `User with email ${email} does not exist.`)
    }
    const result = await PasswordResetToken.create({
      userId: user._id.toString(),
      verificationToken: crypto.randomBytes(32).toString('hex'),
    })
    await sendPasswordResetCode(email, result.verificationToken)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
}
export const resetPassword: RequestHandler<
  unknown,
  unknown,
  ResetPasswordBody,
  unknown
> = async (req, res, next) => {
  try {
    const { email, password: newPasswordRow, verificationCode } = req.body
    const existingUser = await UserModel.findOne({ email })
      .select('+email')
      .collation({ locale: 'en', strength: 2 })
      .exec()
    if (!existingUser) {
      throw createHttpError(404, 'User not found.')
    }
    const passwordResetToken = await PasswordResetToken.findOne({
      userId: existingUser._id,
      verificationToken: verificationCode,
    }).exec()
    if (!passwordResetToken) {
      throw createHttpError(400, 'Verification code incorrect or expired.')
    } else {
      await passwordResetToken.deleteOne()
    }
    await destroyAllActiveSessionsForUser(existingUser._id.toString())
    const newPasswordHashed = await bcrypt.hash(newPasswordRow as string, 10)
    existingUser.password = newPasswordHashed
    const user = existingUser.toObject()
    delete user.password
    await existingUser.save()
    req.logIn(user, (error) => {
      if (error) throw error
      res.status(200).json(user)
    })
  } catch (error) {
    next(error)
  }
}

export const removeUser: RequestHandler<
  RemoveUserParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await UserModel.findById(userId).exec()
    if (!user) {
      throw createHttpError(404, 'User not found')
    }
    const verificationToken = await TokenModel.findOne({ userId })
    if (verificationToken) {
      verificationToken.deleteOne()
    }
    await user.deleteOne()
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
