import { Router } from 'express'
import upload from '../middleware/multer'
import recipeController from '../controllers/recipe.controller'
import requireUser from '../middleware/requireuser'
import validateInput from '../middleware/validateInput'
import { createRecipeSchema, updateRecipeSchema } from '../schema/recipe.schema'

const router = Router()

router.route('/')
  .get(recipeController.getAllRecipesHandler)
  .post([requireUser, validateInput(createRecipeSchema)], upload.single('file'), recipeController.createRecipeHandler)

router.route('/:recipeId')
  .get(recipeController.getSingleRecipeHandler)
  .patch([requireUser, validateInput(updateRecipeSchema)], recipeController.updateRecipeHandler)
  .delete(requireUser, recipeController.deleteRecipeHandler)

router.route('/user/:user')
  .get(recipeController.getUserRecipesHandler)

export default router   
