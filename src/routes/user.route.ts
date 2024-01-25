import { Router } from 'express'
import { validate_input }from '../middleware'
import { UserController } from '../controllers'
import { createUserSchema } from '../schema/user.schema'
import { updateAuthSchema } from '../schema/reset.schema'

const router = Router()

router.post(
  '/register', 
  validate_input(createUserSchema), 
  UserController.createUserHandler
)

router.patch(
  '/reset/:id/:token', 
  validate_input(updateAuthSchema), 
  UserController.resetPasswordHandler
)

router.post('/forgot_password', UserController.forgortPasswordHandler)

export default router 
