import { Router } from 'express'
import bookmarksController from '../controllers/bookmarks'
import verifyJWT from '../middleware/auth'

const router = Router()

router.route('/:id')
  .get(verifyJWT, bookmarksController.userBookmarks)

router.route('/:user_id/:recipe_id')
  .post(verifyJWT, bookmarksController.addBookmark)
  .delete(verifyJWT, bookmarksController.removeBookmark)

export default router  
