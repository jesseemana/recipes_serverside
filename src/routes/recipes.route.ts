import { Router } from 'express';
import { upload, requireUser, validateInput } from '../middleware';
import { RecipeController } from '../controllers';
import { createRecipeSchema, updateRecipeSchema } from '../schema/recipe.schema';

const router = Router();

router.route('/')
  .get(RecipeController.getAllRecipesHandler)
  .post(
    [requireUser, validateInput(createRecipeSchema), upload.single('file')], 
    RecipeController.createRecipeHandler
  );

router.route('/:id')
  .get(RecipeController.getSingleRecipeHandler)
  .patch([requireUser, validateInput(updateRecipeSchema)], RecipeController.updateRecipeHandler)
  .delete(requireUser, RecipeController.deleteRecipeHandler);

router.get('/user/:user_id', RecipeController.getUserRecipesHandler);

export default router;
