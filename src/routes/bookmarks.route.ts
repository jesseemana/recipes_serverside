import { Router } from 'express'
import bookmarksController from '../controllers/bookmarks'
import requireUser from '../middleware/requireuser'

const router = Router()

router.route('/:id')
  .get(requireUser, bookmarksController.userBookmarks)

router.route('/:user_id/:recipe_id')
  .post(requireUser, bookmarksController.addBookmark)
  .delete(requireUser, bookmarksController.removeBookmark)

export default router  
