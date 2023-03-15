// INSTALL EXPRESS-RATE-LIMIT 
const rateLimit = require('express-rate-limit')

const loginLimiter = rateLimit({})

module.export = loginLimiter