import { Router } from 'express'
import { updateRecipeSchema } from '../schema/recipe.schema'
import { upload, requireUser, validateInput } from '../middleware'
import { RecipeController, GetRecipeController } from '../controllers'

const router = Router()

router.route('/')
  .get(GetRecipeController.getAllRecipesHandler)
  .post(requireUser, [upload.single('file')], RecipeController.createRecipeHandler)

router.route('/:id')
  .get(GetRecipeController.getSingleRecipeHandler)
  .patch([requireUser, validateInput(updateRecipeSchema)], RecipeController.updateRecipeHandler)
  .delete(requireUser, RecipeController.deleteRecipeHandler)

router.get('/user/:user_id', GetRecipeController.getUserRecipesHandler)

export default router  
