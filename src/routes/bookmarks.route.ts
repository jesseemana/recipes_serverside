import { Router } from 'express';
import { BookmarksController } from '../controllers';
import { requireUser, validateInput } from '../middleware';
import { bookmarkRecipeSchema } from '../schema/bookmarks.schema';

const router = Router();

const { userBookmarksHandler, addBookmarkHandler, removeBookmarkHandler } = BookmarksController;

/**
 * @openapi
 * '/api/v2/bookmarks/:user_id':
 *  get:
 *    tags:
 *    - Bookmarks
 *    summary: Get user bookmarks
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schema/GetBookmarks'
 *      403:
 *        description: Forbidden
 *      404:
 *        description: No bookmarks found
 */
router.get('/:user_id', requireUser, userBookmarksHandler);

/**
 * @openapi
 * '/api/v2/bookmarks/:user_id/:recipe_id':
 *  post:
 *     tags:
 *     - Bookmarks
 *     summary: Add a bookmark
 *     responses:
 *       200:
 *         description: Success
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or recipe not found
 *  delete:
 *       tags:
 *       - Bookmarks
 *       summary: Remove a bookmark
 *       responses:
 *         200:
 *           description: Success
 *         400:
 *           description: Bad request
 *         403:
 *           description: Forbidden
 *         404:
 *           description: User or recipe not found
 */
router.route('/:user_id/:recipe_id')
  .post(
    [requireUser, validateInput(bookmarkRecipeSchema)], 
    addBookmarkHandler
  )
  .delete(
    [requireUser, validateInput(bookmarkRecipeSchema)], 
    removeBookmarkHandler
  );

export default router;
