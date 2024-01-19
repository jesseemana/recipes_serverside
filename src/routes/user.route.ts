import { Router } from 'express'
import { UserController } from '../controllers'
import { validateInput }from '../middleware'
import { createUserSchema } from '../schema/user.schema'
import { updateAuthSchema } from '../schema/reset.schema'

const router = Router()

router.post(
  '/register', 
  validateInput(createUserSchema), 
  UserController.createUserHandler
)

router.patch(
  '/reset/:id/:token', 
  validateInput(updateAuthSchema), 
  UserController.resetPasswordHandler
)

router.post('/forgot_password', UserController.forgortPasswordHandler)

export default router 
