import { Router } from 'express';
import { validateInput }from '../middleware';
import { UserController } from '../controllers';
import { createUserSchema } from '../schema/user.schema';
import { updateAuthSchema } from '../schema/reset.schema';

const router = Router();

const { createUserHandler, resetPasswordHandler, forgortPasswordHandler } = UserController;

router.post('/register', validateInput(createUserSchema), createUserHandler);

router.patch('/:id/reset/:token', validateInput(updateAuthSchema), resetPasswordHandler);

router.post('/forgot_password', forgortPasswordHandler);

export default router;
