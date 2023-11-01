import express from 'express'
import * as UserController from '../controllers/user.controller'
import validateRequestSchema from '../middlewares/validateRequestSchema'
import { signUpSchema } from '../validation/user.validator'
import passport from 'passport'

const router = express.Router()

router.get('/me', UserController.getAuthenticatedUser)

router.post(
  '/signup',
  validateRequestSchema(signUpSchema),
  UserController.signup
)
router.post('/login', passport.authenticate('local'), (req, res) =>
  res.status(200).json(req.user)
)

router.post('/logout', UserController.logOut)

export default router
