import { Router } from 'express'
import { getAllRecipesHandler, getSingleRecipeHandler, getUserRecipesHandler } from '../controllers/get-recipe.controller'

const router = Router()

router.get('/', getAllRecipesHandler)
router.get('/:id', getSingleRecipeHandler)
router.get('/:user_id', getUserRecipesHandler)

export default router
