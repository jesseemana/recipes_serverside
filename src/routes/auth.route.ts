import { Router } from 'express'
import loginLimiter from '../middleware/login-limiter'
import { createSessionHandler, destroySessionHandler, refreshTokenHandler } from '../controllers/auth.controller'
import validateInput from '../middleware/validateInput'
import { createSessionSchema } from '../schema/user.schema'
import requireUser from '../middleware/require-user'

const router = Router()

router.post('/login', validateInput(createSessionSchema), loginLimiter, createSessionHandler)
router.get('/refresh', refreshTokenHandler)
router.post('/logout', requireUser, destroySessionHandler)

export default router
