const Recipe = require('../models/recipe')
const User = require('../models/users')


const getRecipes = async (req, res) => {
    const recipes = await Recipe.find().lean()
    if(!recipes?.length) return res.status(400).json({message: 'There are currently no recipes'})

    // ATTACHING A SPECIFIC USER TO A RECIPE THEY CREATED 
    const recipeWithUser = await Promise.all(recipes.map(async (recipe) => {
        const user = await User.findById(recipe.user).lean().exec()
        return {...recipe, username: user.username}
    }))
    
    // res.json(recipes)
    res.json(recipeWithUser)
}


const createRecipe = async(req, res) => {
    const {user, name, ingridients, procedure, category, time} = req.body
    
    if(!user || !name || !ingridients.length || !procedure || !category || !time) return res.status(400).json({message: 'Please provide all fields'})

    const duplicate = await Recipe.findOne({name}).collation({locale: 'en', strength: 2}).lean().exec()
    if(duplicate) return res.status(409).json({message: 'Recipe already exist'})

    const recipe = await Recipe.create({
        user,
        name,
        ingridients,
        procedure,
        category,
        time
    })

    if(recipe) {
        return res.status(201).json({message: `Recipe for ${recipe.name} succesfully created`})
    } else {
        return res.status(400).json({message: 'Inavlid data received'})
    }
}


const updatetRecipe = async (req, res) => {
    res.json({message: 'Recipe updated'});
}


const deleteRecipe = async (req, res) => {
    res.json({message: 'Recipe deleted'});
}


module.exports = {
    getRecipes,
    createRecipe,
    updatetRecipe,
    deleteRecipe
}
