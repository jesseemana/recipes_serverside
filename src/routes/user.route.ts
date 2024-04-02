import { Router } from 'express';
import { UserController } from '../controllers';
import { createUserSchema } from '../schema/user.schema';
import { validateInput, requireUser }from '../middleware';
import { updateAuthSchema } from '../schema/reset.schema';

const router = Router();

router.post('/', validateInput(createUserSchema), UserController.createUserHandler);

router.post('/me', requireUser, UserController.getCurrentUserHandler);

router.post('/forgot_password', UserController.forgortPasswordHandler);

router.patch('/:id/reset/:token', validateInput(updateAuthSchema), UserController.resetPasswordHandler);

export default router;
