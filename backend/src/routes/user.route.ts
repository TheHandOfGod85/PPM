import express from 'express'
import * as UserController from '../controllers/user.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import {
  requestResetPasswordvalidator,
  resetPasswordValidator,
  sendRegistrationValidator,
  signUpSchema,
  updateUserValidator,
} from '../validation/user.validator'
import passport from 'passport'
import { requireAuth, restrictTo } from '../middlewares/requireAuth'

const router = express.Router()

router.get('/me', requireAuth, UserController.getAuthenticatedUser)
// Used for testing purposes
// router.get('/me', UserController.getAuthenticatedUser)

router.get(
  '/allUsers',
  requireAuth,
  restrictTo('admin'),
  UserController.getUsersHandler
)

router.post(
  '/signup',
  validateRequestSchema(signUpSchema),
  UserController.signup
)
router.post('/login', passport.authenticate('local'), (req, res) =>
  res.status(200).json(req.user)
)

router.post('/logout', UserController.logOut)

router.patch(
  '/updateMe',
  requireAuth,
  validateRequestSchema(updateUserValidator),
  UserController.updateUserHandler
)

router.post(
  '/send-registration',
  requireAuth,
  restrictTo('admin'),
  validateRequestSchema(sendRegistrationValidator),
  UserController.sendRegistration
)

router.post(
  '/reset-password-code',
  validateRequestSchema(requestResetPasswordvalidator),
  UserController.requestResetPasswordCode
)
router.post(
  '/reset-password',
  validateRequestSchema(resetPasswordValidator),
  UserController.resetPassword
)
export default router
