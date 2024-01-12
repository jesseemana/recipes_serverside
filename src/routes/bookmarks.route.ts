import { Router } from 'express'
import { BookmarksController } from '../controllers'
import { requireUser, validateInput } from '../middleware'
import { bookmarkRecipeSchema } from '../schema/bookmarks.schema'

const router = Router()

router.get('/:id', requireUser, BookmarksController.userBookmarksHandler)

router.route('/:user_id/:recipe_id')
  .post([requireUser, validateInput(bookmarkRecipeSchema)], BookmarksController.addBookmarkHandler)
  .delete([requireUser, validateInput(bookmarkRecipeSchema)], BookmarksController.removeBookmarkHandler)

export default router  
