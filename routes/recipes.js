const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipe')
const verifyJWT = require('../middleware/auth')


router.route('/')
    .get(recipeController.getRecipes)
    .patch(verifyJWT, recipeController.updatedRecipe)
    .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/:id')
    .get(recipeController.getSingleRecipe)

router.route('/user/:user')
    .get(recipeController.getUserRecipes)

module.exports = router 