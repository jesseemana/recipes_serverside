const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/auth')
const recipeController = require('../controllers/recipe')


router.route('/')
    .get(recipeController.getRecipes)
    .patch(verifyJWT, recipeController.updateRecipe)
    .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/:id/:userId')
    .get(recipeController.getSingleRecipe)

// router.route('/category')
//     .get(recipeController.filterRecipe)

router.route('/user/:user')
    .get(recipeController.getUserRecipes)

module.exports = router         