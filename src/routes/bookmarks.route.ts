import { Router } from 'express'
import { userBookmarksHandler, addBookmarkHandler, removeBookmarkHandler } from '../controllers/bookmarks.controller'
import requireUser from '../middleware/requireuser'

const router = Router()

router.get('/:id', requireUser, userBookmarksHandler)

router.route('/:user_id/:recipe_id')
  .post(requireUser, addBookmarkHandler)
  .delete(requireUser, removeBookmarkHandler)

export default router  
