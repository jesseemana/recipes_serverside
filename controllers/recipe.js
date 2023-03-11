const Recipe = require('../models/recipe')

const getRecipes = (req, res) => {
    res.json({message: 'Recipes found'})
}

const createRecipe = (req, res) => {
    res.json({message: 'Recipe created'});
}

const updatetRecipe = (req, res) => {
    res.json({message: 'Recipe updated'});
}

const deleteRecipe = (req, res) => {
    res.json({message: 'Recipe deleted'});
}

module.exports = {
    getRecipes,
    createRecipe,
    updatetRecipe,
    deleteRecipe
}
