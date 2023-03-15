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
    
    if(!user || !name || !ingridients.length || !procedure || !category || !time) return res.status(400).json({message: 'Please provide all fields!'})

    const recipe = await Recipe.create({
        user,
        name,
        ingridients,
        procedure,
        category,
        time
    })

    if(recipe) {
        return res.status(201).json({message: `Recipe for ${recipe.name} created succesfully.`})
    } else {
        return res.status(400).json({message: 'Invalid data received.'})
    }
}


const updatetRecipe = async (req, res) => {
    const {id, name, ingridients, procedure, category, time} = req.body

    if(!id || !name || !ingridients.length || !procedure || !category || !time) return res.status(400).json({message: 'Please provide all fields!'})

    const recipe = await Recipe.findById(id).exec()
    if(!recipe) return res.status(400).json({message: 'Recipe not found!'})

    const duplicate = await Recipe.findOne({name}).collation({locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(409).json({message: 'Recipe already exist!'})

    recipe.name = name
    recipe.ingridients = ingridients
    recipe.procedure = procedure
    recipe.category = category
    recipe.time = time

    const updatedRecipe = await recipe.save()

    res.json({updatedRecipe})
}


const deleteRecipe = async (req, res) => {
    const {id} = req.body
    if(!id) return res.status(400).json({message: 'Recipe ID is required'})

    const recipe = await Recipe.findById(id)
    if(!recipe) return res.status(400).json({message: 'Recipe not found'})

    const result = recipe.deleteOne()
    const message = `Recipe for ${result.name} with ID: ${result._id}, has been deleted`

    res.json(message)
}


module.exports = {
    getRecipes,
    createRecipe,
    updatetRecipe,
    deleteRecipe
}