import { Router } from 'express'
import upload from '../middleware/multer'
import verifyJWT from '../middleware/auth.middleware'
import recipeController from '../controllers/recipe'

const router = Router()

router.route('/')
  .get(recipeController.getAllRecipes)
  .post(verifyJWT, upload.single('file'), recipeController.createRecipe)
  .patch(verifyJWT, recipeController.updateRecipe)

router.route('/:id')
  .get(recipeController.getSingleRecipe)
  .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/user/:user')
  .get(recipeController.getUserRecipes)

export default router   
