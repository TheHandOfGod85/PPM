import { NextFunction, Request, RequestHandler, Response } from 'express'
import createHttpError from 'http-errors'
import assertIsDefined from '../utils/assertDefined'

export const requireAuth: RequestHandler = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    next(createHttpError(401, 'User not authenticated'))
  }
}

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    assertIsDefined(req.user)
    if (!roles.includes(req.user.role)) {
      throw createHttpError(
        403,
        'You do not have the permission to perform this action'
      )
    }
    next()
  }
}
