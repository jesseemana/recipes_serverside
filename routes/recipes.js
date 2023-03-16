const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');
const verifyJWT = require('../middleware/auth')

router.use(verifyJWT)

router.route('/')
    .get(recipeController.getRecipes)
    .patch(recipeController.updatetRecipe)
    .delete(recipeController.deleteRecipe)

module.exports = router;