import { Router } from 'express';
import { UserController } from '../controllers';
import { resetAuthSchema, updateAuthSchema } from '../schema/reset.schema';
import { createUserSchema } from '../schema/user.schema';
import { validateInput, requireUser }from '../middleware';

const router = Router();

router.post('/me', requireUser, UserController.getCurrentUserHandler);

router.post('/', validateInput(createUserSchema), UserController.createUserHandler);

router.post(
    '/forgot-password', 
    validateInput(resetAuthSchema), 
    UserController.forgortPasswordHandler
  );

router.patch(
    '/:id/reset/:token', 
    validateInput(updateAuthSchema), 
    UserController.resetPasswordHandler
  );

export default router;
