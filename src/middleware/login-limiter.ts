import rateLimit from 'express-rate-limit'
import { Request, Response, NextFunction } from 'express'

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // delay in milliseconds
  max: 5,  // set the login limit to 5
  message: { message: 'Too many login attempts, please try again after a 2 minute pause' },
  handler: (_req: Request, res: Response, _next: NextFunction, options) => {
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
