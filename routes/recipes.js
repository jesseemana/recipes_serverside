const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipe')
const verifyJWT = require('../middleware/auth')


router.route('/')
    .get(recipeController.getRecipes)
    .patch(verifyJWT, recipeController.updatedRecipe)
    .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/bookmark/:recipeId/:userId')
    .post(verifyJWT, recipeController.bookmarkRecipe)
    .delete(verifyJWT, recipeController.removeBookmark)

// router.route('/category')
//     .get(recipeController.filterRecipe)

router.route('/:id')
    .get(recipeController.getSingleRecipe)

router.route('/user/:user')
    .get(recipeController.getUserRecipes)

module.exports = router 