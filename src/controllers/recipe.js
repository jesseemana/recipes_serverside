const User = require('../models/User')
const Recipe = require('../models/Recipe')
const cloudinary = require('../utils/cloudinary')


const getRecipes = async (req, res) => {
  const { page } = req.query

  // PAGINATION SETUP
  const LIMIT = 20
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  const total = await Recipe.countDocuments({})

  const recipes = await Recipe.find().lean().sort({createdAt: -1}).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) 
    return res.status(400).json({ 'message': 'There are no recipes found' })

  // ATTACHING A SPECIFIC USER TO A RECIPE THEY CREATED 
  const recipes_with_user = await Promise.all(recipes.map(async (recipe) => {
    const user = await User.findById(recipe.user).lean().exec()
    return { ...recipe, username: `${user.first_name} ${user.last_name}` }
  }))

  res.status(200).json({
    recipes: recipes_with_user, 
    current_page: Number(page), 
    total_pages: Math.ceil(total / LIMIT)
  })
}

 
const getUserRecipes = async (req, res) => {
  const { user } = req.params
  const LIMIT = 20
  const startIndex = (Number(req.query.page) - 1) * LIMIT // starting index of every page
  // const total = await Recipe.countDocuments({})
  if (!user) 
    return res.status(400).json({ 'message': 'Provide a user id' })
  const recipes = await Recipe.find({ user }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) 
    return res.status(400).json({ 'message': `User doesn't have any recipes` })
  const owner = await User.findById(user)
  const full_name = `${owner.first_name} ${owner.last_name}`

  res.status(200).json({ recipes, full_name })
}


const getSingleRecipe = async (req, res) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ 'message': 'Provide recipe id' })
  const recipe = await Recipe.findById(id).lean().exec()
  if (!recipe) return res.status(400).json({ 'message': 'Recipe not found' })
  
  const user = await User.findById(recipe.user).lean().exec()
  const owner = `${user.first_name} ${user.last_name}`

  res.status(200).json({
    recipe, 
    owner, 
  })
}


const createRecipe = async (req, res) => {
  const { user, name, ingridients, category, time, procedure } = req.body
  if (!user || !name || !ingridients || !procedure || !category || !time )
    return res.status(400).json({ 'message': 'Please provide all fields!' })
  
  const response = await cloudinary.uploader.upload(req.file.path)

  const recipe = new Recipe({
    user,
    name,
    ingridients,
    category,
    time,
    procedure,
    picture_path: response.secure_url,
    cloudinary_id: response.public_id,
  })

  await recipe.save()

  if (recipe) {
    return res.status(201).json({ 'message': `Recipe for ${recipe.name} created succesfully.` })
  } else {
    res.status(400).json({ 'message': 'Invalid data received.' })
  }
}


const updateRecipe = async (req, res) => {
  const { id, name, ingridients, procedure, category, time } = req.body
  if (!id || !name || !ingridients || !procedure || !category || !time)
    return res.status(400).json({ 'message': 'Please provide all fields!' })

  const recipe = await Recipe.findById(id).exec()
  if (!recipe) return res.status(400).json({ 'message': 'Recipe not found!' })

  recipe.time = time
  recipe.name = name
  recipe.category = category
  recipe.procedure = procedure
  recipe.ingridients = ingridients

  const updated_recipe = await recipe.save()

  res.status(201).json(updated_recipe)
}


const deleteRecipe = async (req, res) => {
  const { id } = req.body
  if (!id) 
    return res.status(400).json({ 'message': 'Recipe id is required' })
  const recipe = await Recipe.findById(id)
  if (!recipe) 
    return res.status(400).json({ 'message': 'Recipe not found' })
  await cloudinary.uploader.destroy(recipe.cloudinary_id) // delete from cloudinary
  await recipe.deleteOne() // delete from db
  const message = `Recipe has been deleted`
  res.json(message)
}


module.exports = {
  getRecipes,
  getUserRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getSingleRecipe,
}  