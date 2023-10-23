const rateLimit = require('express-rate-limit')
const { logEvents } = require('./logger')

const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // one minute, increase to five minutes in production
  max: 5,  // set the login limit to 5
  message: { message: 'Too many login attempts, please try again after a 60 second pause' },
  handler: (req, res, next, options) => {
    logEvents(`Too many log in attempts: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, `errLog.log`)
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = loginLimiter