const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipe')
const verifyJWT = require('../middleware/auth')

router.use(verifyJWT)

router.route('/')
    .get(recipeController.getRecipes)
    .patch(recipeController.updatedRecipe)
    .delete(recipeController.deleteRecipe)

router.route('/:id')
    .get(recipeController.getSingleRecipe)

router.route('/:userId/recipes')
    .get(recipeController.getUSerRecipes)

module.exports = router 