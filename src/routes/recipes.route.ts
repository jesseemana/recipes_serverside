import { Router } from 'express'
import upload from '../middleware/multer'
import recipeController from '../controllers/recipe'
import requireUser from '../middleware/requireuser'

const router = Router()

router.route('/')
  .get(recipeController.getAllRecipes)
  .post(requireUser, upload.single('file'), recipeController.createRecipe)
  .patch(requireUser, recipeController.updateRecipe)

router.route('/:id')
  .get(recipeController.getSingleRecipe)
  .delete(requireUser, recipeController.deleteRecipe)

router.route('/user/:user')
  .get(recipeController.getUserRecipes)

export default router   
