import { Router } from 'express'
import { updateRecipeSchema } from '../schema/recipe.schema'
import { upload, require_user, validate_input } from '../middleware'
import { RecipeController, GetRecipeController } from '../controllers'

const router = Router()

router.route('/')
  .get(GetRecipeController.getAllRecipesHandler)
  .post(
    [require_user, upload.single('file')], 
    RecipeController.createRecipeHandler,
  )

router.route('/:id')
  .get(GetRecipeController.getSingleRecipeHandler)
  .delete(require_user, RecipeController.deleteRecipeHandler)
  .patch(
    [require_user, validate_input(updateRecipeSchema)], 
    RecipeController.updateRecipeHandler,
  )

router.get('/user/:user_id', GetRecipeController.getUserRecipesHandler)

export default router  
