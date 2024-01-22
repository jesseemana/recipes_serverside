import { Router } from 'express'
import { AuthController } from '../controllers'
import { createSessionSchema } from '../schema/user.schema'
import { login_limiter, validate_input, require_user }from '../middleware'

const router = Router()


/**
 * @openapi
 * '/api/v2/auth/sessions':
 * get:
 *    tags:
 *    - Auth
 *    summary: Get sessions
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/SessionsResponse'
 *      401:
 *        description: Unauthorized
 *      403:
 *        description: Forbidden
 */
router.get('/sessions', require_user, AuthController.findSessionsHandler)


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
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schema/loginUserResponse'
 *        404:
 *          description: Invalid email/user not found
 *        401:
 *          description: Invalid password
 */
router.post('/login', [validate_input(createSessionSchema), login_limiter], AuthController.createSessionHandler)


/**
 * @openapi
 * '/api/v2/auth/refresh':
 * get:
 *    tags:
 *    - Auth
 *    summary: Refresh token
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/RefreshTokenResponse'
 *      401:
 *        description: Refersh token/Session not found or is invalid
 *      403:
 *        description: No refresh token found
 *      404:
 *        description: User not found
 */
router.get('/refresh', AuthController.refreshTokenHandler)


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
router.delete('/logout', require_user, AuthController.destroySessionHandler)


export default router
