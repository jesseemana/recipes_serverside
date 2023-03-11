const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe');

router.route('/')
    .get(recipeController.getRecipes)
    .post(recipeController.createRecipe)
    .patch(recipeController.updatetRecipe)
    .delete(recipeController.deleteRecipe);

module.exports = router;