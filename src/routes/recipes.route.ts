import { Router } from 'express'
import { createRecipeSchema, updateRecipeSchema } from '../schema/recipe.schema'
import { upload, requireUser, validateInput } from '../middleware'
import { RecipeController, GetRecipeController } from '../controllers'

const router = Router()

router.route('/')
  .get(GetRecipeController.getAllRecipesHandler)
  .post(
    [requireUser, validateInput(createRecipeSchema), upload.single('file')], 
    RecipeController.createRecipeHandler,
  )

router.route('/:id')
  .get(GetRecipeController.getSingleRecipeHandler)
  .delete(requireUser, RecipeController.deleteRecipeHandler)
  .patch(
    [requireUser, validateInput(updateRecipeSchema)], 
    RecipeController.updateRecipeHandler,
  )

router.get('/user/:user_id', GetRecipeController.getUserRecipesHandler)

export default router  
