import { Router } from 'express'
import { createUserHandler, forgortPasswordHandler, resetPasswordHandler } from '../controllers/user.controller'
import validateInput from '../middleware/validate-input'
import { resetAuthSchema, updateAuthSchema } from '../schema/reset.schema'
import { createUserSchema } from '../schema/user.schema'

const router = Router()

router.post('/register', validateInput(createUserSchema), createUserHandler)
router.post('/forgot_password', forgortPasswordHandler)
router.patch('/reset/:id/:token', validateInput(updateAuthSchema), resetPasswordHandler)

export default router 
