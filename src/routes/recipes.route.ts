import { Router } from 'express'
import upload from '../middleware/multer'
import recipeController from '../controllers/recipe.controller'
import requireUser from '../middleware/requireuser'

const router = Router()

router.route('/')
  .get(recipeController.getAllRecipesHandler)
  .post(requireUser, upload.single('file'), recipeController.createRecipeHandler)

router.route('/:recipeId')
  .get(recipeController.getSingleRecipeHandler)
  .patch(requireUser, recipeController.updateRecipeHandler)
  .delete(requireUser, recipeController.deleteRecipeHandler)

router.route('/user/:user')
  .get(recipeController.getUserRecipesHandler)

export default router   
