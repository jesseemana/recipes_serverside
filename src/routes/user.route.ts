import { Router } from 'express'
import { UserController } from '../controllers'
import { validateInput }from '../middleware'
import { createUserSchema } from '../schema/user.schema'
import { resetAuthSchema, updateAuthSchema } from '../schema/reset.schema'

const router = Router()

router.post('/register', validateInput(createUserSchema), UserController.createUserHandler)
router.post('/forgot_password', UserController.forgortPasswordHandler)
router.patch('/reset/:id/:token', validateInput(updateAuthSchema), UserController.resetPasswordHandler)

export default router 
