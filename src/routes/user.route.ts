import { Router } from 'express';
import { validateInput }from '../middleware';
import { UserController } from '../controllers';
import { createUserSchema } from '../schema/user.schema';
import { updateAuthSchema } from '../schema/reset.schema';

const router = Router();

router.post(
  '/register', 
  validateInput(createUserSchema), 
  UserController.createUserHandler
);

router.patch(
  '/:id/reset/:token', 
  validateInput(updateAuthSchema), 
  UserController.resetPasswordHandler
);

router.post('/forgot_password', UserController.forgortPasswordHandler);

export default router;
