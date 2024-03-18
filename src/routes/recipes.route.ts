import { Router } from 'express';
import { upload, requireUser, validateInput } from '../middleware';
import { RecipeController, GetRecipeController } from '../controllers';
import { createRecipeSchema, updateRecipeSchema } from '../schema/recipe.schema';

const router = Router();

const { createRecipeHandler, updateRecipeHandler, deleteRecipeHandler } = RecipeController;
const { getSingleRecipeHandler, getAllRecipesHandler, getUserRecipesHandler } = GetRecipeController;

router.route('/')
  .get(getAllRecipesHandler)
  .post(
    [requireUser, validateInput(createRecipeSchema), upload.single('file')], 
    createRecipeHandler,
  );

router.route('/:id')
  .get(getSingleRecipeHandler)
  .delete(requireUser, deleteRecipeHandler)
  .patch(
    [requireUser, validateInput(updateRecipeSchema)], 
    updateRecipeHandler,
  );

router.get('/user/:user_id', getUserRecipesHandler);

export default router;
