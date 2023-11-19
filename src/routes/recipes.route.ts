import { Router } from 'express'
import upload from '../middleware/multer'
import { createRecipeHandler, updateRecipeHandler, deleteRecipeHandler } from '../controllers/recipe.controller'
import requireUser from '../middleware/require-user'
import validateInput from '../middleware/validateInput'
import { updateRecipeSchema } from '../schema/recipe.schema'

const router = Router()

router.route('/')
  .post(requireUser, [upload.single('file')], createRecipeHandler)

router.route('/:id')
  .patch([requireUser, validateInput(updateRecipeSchema)], updateRecipeHandler)
  .delete(requireUser, deleteRecipeHandler)

export default router  
