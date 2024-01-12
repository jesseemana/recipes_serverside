import { Router } from 'express'
import { AuthController } from '../controllers'
import { createSessionSchema } from '../schema/user.schema'
import { loginLimiter, validateInput, requireUser }from '../middleware'

const router = Router()

router.get('/sessions', requireUser, AuthController.findSessionsHandler)
router.post('/login', [validateInput(createSessionSchema), loginLimiter], AuthController.createSessionHandler)
router.get('/refresh', AuthController.refreshTokenHandler)
router.post('/logout', requireUser, AuthController.destroySessionHandler)

export default router
