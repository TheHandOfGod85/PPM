import express from 'express'
import * as UserController from '../controllers/user.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import {
  removeUserValidator,
  requestResetPasswordvalidator,
  resetPasswordValidator,
  sendRegistrationValidator,
  signUpSchema,
  updateUserValidator,
} from '../validation/user.validator'
import passport from 'passport'
import { requireAuth, restrictTo } from '../middlewares/requireAuth'
import {
  loginRateLimit,
  requestVerificationCodeLimit,
} from '../middlewares/rate-limit'

const router = express.Router()

router.get('/me', UserController.getAuthenticatedUser)
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
router.post(
  '/login',
  loginRateLimit,
  passport.authenticate('local'),
  (req, res) => res.status(200).json(req.user)
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
  requestVerificationCodeLimit,
  validateRequestSchema(sendRegistrationValidator),
  UserController.sendRegistration
)

router.post(
  '/reset-password-code',
  requestVerificationCodeLimit,
  validateRequestSchema(requestResetPasswordvalidator),
  UserController.requestResetPasswordCode
)
router.post(
  '/reset-password',
  validateRequestSchema(resetPasswordValidator),
  UserController.resetPassword
)

router.delete(
  '/remove/:userId',
  requireAuth,
  restrictTo('admin'),
  validateRequestSchema(removeUserValidator),
  UserController.removeUser
)

router.get('/isLoggedIn', UserController.isLoggedIn)
export default router
