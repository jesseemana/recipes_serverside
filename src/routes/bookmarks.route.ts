import { Router } from 'express'
import { userBookmarksHandler, addBookmarkHandler, removeBookmarkHandler } from '../controllers/bookmarks.controller'
import requireUser from '../middleware/require-user'
import validateInput from '../middleware/validateInput'
import { bookmarkRecipeSchema } from '../schema/bookmarks.schema'

const router = Router()

router.get('/:id', requireUser, userBookmarksHandler)

router.route('/:user_id/:recipe_id')
  .post([requireUser, validateInput(bookmarkRecipeSchema)], addBookmarkHandler)
  .delete([requireUser, validateInput(bookmarkRecipeSchema)], removeBookmarkHandler)

export default router  
