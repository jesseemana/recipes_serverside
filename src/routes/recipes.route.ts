import { Router } from 'express'
import upload from '../middleware/multer'
import { createRecipeHandler, updateRecipeHandler, deleteRecipeHandler } from '../controllers/recipe.controller'
import requireUser from '../middleware/require-user'
import validateInput from '../middleware/validateInput'
import { updateRecipeSchema } from '../schema/recipe.schema'
import { getAllRecipesHandler, getSingleRecipeHandler, getUserRecipesHandler } from '../controllers/get-recipe.controller'

const router = Router()

router.route('/')
  .get(getAllRecipesHandler)
  .post(requireUser, [upload.single('file')], createRecipeHandler)

router.route('/:id')
  .get(getSingleRecipeHandler)
  .patch([requireUser, validateInput(updateRecipeSchema)], updateRecipeHandler)
  .delete(requireUser, deleteRecipeHandler)

router.get('/user/:user_id', getUserRecipesHandler)

export default router  
