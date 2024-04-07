import { Router } from 'express';
import { BookmarkController, RecipeController } from '../controllers';
import { upload, requireUser, validateInput } from '../middleware';
import { createRecipeSchema, updateRecipeSchema } from '../schema/recipe.schema';
import { bookmarkRecipeSchema } from '../schema/bookmarks.schema';

const router = Router();

// RECIPES ROUTES
router.route('/')
  .get(RecipeController.getAllRecipesHandler)
  .post(
    [requireUser, validateInput(createRecipeSchema), upload.single('file')], 
    RecipeController.createRecipeHandler
  );

router.get('/user/:user_id', RecipeController.getUserRecipesHandler);

router.route('/:id')
  .get(RecipeController.getSingleRecipeHandler)
  .patch(
    [requireUser, validateInput(updateRecipeSchema)], 
    RecipeController.updateRecipeHandler
  )
  .delete(requireUser, RecipeController.deleteRecipeHandler);


// BOOKMARKS ROUTES
router.get(
  '/bookmarks/:user_id', 
  requireUser, 
  BookmarkController.userBookmarksHandler
  );

router.route('/:user_id/bookmark/:recipe_id')
  .post(
    [requireUser, validateInput(bookmarkRecipeSchema)], 
    BookmarkController.addBookmarkHandler
  )
  .delete(
    [requireUser, validateInput(bookmarkRecipeSchema)], 
    BookmarkController.removeBookmarkHandler
  );

export default router;
