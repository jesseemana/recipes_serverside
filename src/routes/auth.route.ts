import { Router } from 'express'
import verifyUser from '../middleware/auth'
import loginLimiter from '../middleware/loginLimiter'
import { createSessionHandler, createUserHandler, destroySessionHandler, refreshTokenHandler } from '../controllers/auth.controller'
import validateInput from '../middleware/validateinput'
import { createSessionSchema, createUserSchema } from '../schema/schema'

const router = Router()

router.post('/register', validateInput(createUserSchema),createUserHandler)
router.post('/login', validateInput(createSessionSchema), loginLimiter, createSessionHandler)
router.get('/refresh', refreshTokenHandler)
router.post('/logout', verifyUser, destroySessionHandler)

export default router
