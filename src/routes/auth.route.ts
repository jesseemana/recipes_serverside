import { Router } from 'express';
import { loginLimiter, validateInput, requireUser }from '../middleware';
import { AuthController } from '../controllers';
import { createSessionSchema } from '../schema/user.schema';

const router = Router();

/**
 * @openapi
 * '/api/v2/auth/sessions':
 *  get:
 *    tags:
 *    - Auth
 *    summary: Get sessions
 *    responses:
 *      200:
 *        description: Returns all sessions in database
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/SessionResponse'
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.get('/sessions', requireUser, AuthController.findSessionsHandler);

/**
 * @openapi
 *'/api/v2/auth/login':
 *  post:
 *      tags: 
 *      - Auth
 *      summary: Login user
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/loginUserInput'
 *      responses:
 *        200:
 *          description: Creates a new user session
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schema/loginResponse'
 *        401:
 *          description: Invalid email/password
 */
router.post(
    '/login', 
    [validateInput(createSessionSchema), loginLimiter], 
    AuthController.createSessionHandler
  );

/**
 * @openapi
 * '/api/v2/auth/refresh':
 *  get:
 *    tags:
 *    - Auth
 *    summary: Refresh token
 *    responses:
 *      200:
 *        description: Returns a refresh token
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/RefreshResponse'
 *      401:
 *        description: Refresh token/session not found or is invalid
 *      403:
 *        description: No refresh token found
 *      404:
 *        description: User not found
 */
router.get('/refresh', requireUser, AuthController.refreshTokenHandler);

/**
 * @openapi
 * '/api/v2/auth/logout':
 *  delete:
 *        tags:
 *        - Auth
 *        summary: Logout user
 *        responses:
 *          200:
 *              description: User loged out
 *          403:
 *              description: Forbidden
 */
router.delete('/logout', requireUser, AuthController.destroySessionHandler);

export default router;
