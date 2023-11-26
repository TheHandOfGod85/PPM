import rateLimit from 'express-rate-limit'

export const loginRateLimit = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
})
export const requestVerificationCodeLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: true,
})
