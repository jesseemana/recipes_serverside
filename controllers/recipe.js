const User = require('../models/User')
const Recipe = require('../models/Recipe')
const Reviews = require('../models/Review')


const getRecipes = async (req, res) => {
  const { page } = req.query
  // PAGINATION SETUP
  const LIMIT = 20
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  const total = await Recipe.countDocuments({})

  const recipes = await Recipe.find().lean().sort({createdAt: -1}).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) return res.status(400).json({message: 'There are no recipes found'})

  // ATTACHING A SPECIFIC USER TO A RECIPE THEY CREATED 
  const recipes_with_user = await Promise.all(recipes.map(async (recipe) => {
    const user = await User.findById(recipe.user).lean().exec()
    return { ...recipe, username: `${user.first_name} ${user.last_name}` }
  }))

  // res.json(recipes)
  res.status(200).json({
    data: recipes_with_user, 
    current_page: Number(page), 
    total_pages: Math.ceil(total / LIMIT)
  })
}

 
const getUserRecipes = async (req, res) => {
  const { user } = req.params
  const { page } = req.query
  const LIMIT = 16
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  // const total = await Recipe.countDocuments({})

  if (!user) return res.status(400).json({ message: 'Provide a user name' })

  const recipes = await Recipe.find({user}).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) return res.status(400).json({message: `User doesn't have any recipes`})
  const owner = await User.findById(user)
  const full_name = `${owner.first_name} ${owner.last_name}`

  res.status(200).json({recipes, full_name})
}


const getSingleRecipe = async (req, res) => {
  const { id, userId } = req.params
  if (!id) return res.status(400).json({message: 'Provide recipe id'})
  const recipe = await Recipe.findById(id).lean().exec()
  if (!recipe) return res.status(400).json({message: 'Recipe not found'})
  
  // const reviews = await Reviews.find({recipe: id}).sort({createdAt: 'desc'}).lean() // START HERE ONCE WE'RE RUNNING
  const user = await User.findById(recipe.user).lean().exec()
  const full_name = `${user.first_name} ${user.last_name}`
  // FINDING THE LOGGED IN USER IN THE DATABASE AND RETURNING THEIR SAVED RECIPES 
  const loggedInUser = await User.findById(userId).lean().exec() // TRY WITH req.user 

  const bookmarks = []
  for (const bookmark of loggedInUser.bookmarks) {
    const recipe = await Recipe.findById(bookmark)
    if (recipe) { bookmarks.push(recipe) }
  }

  res.status(200).json({
    recipe, 
    full_name, 
    bookmarks, 
    // reviews,
  })
}


const likeRecipe = async (req, res) => {}


const createRecipe = async (req, res) => {
  const { user, name, ingridients, category, time, procedure, picture_path } = req.body
  if (!user || !name || !ingridients || !procedure || !category || !time || !picture_path)
    return res.status(400).json({message: 'Please provide all fields!'})

  const recipe = new Recipe({
    user,
    name,
    ingridients,
    category,
    time,
    picture_path,
    procedure,
  })

  await recipe.save()

  if (recipe) {
    return res.status(201).json({message: `Recipe for ${recipe.name} created succesfully.`})
  } else {
    return res.status(400).json({message: 'Invalid data received.'})
  }
}


const updateRecipe = async (req, res) => {
  const { id, name, ingridients, procedure, category, time } = req.body
  if (!id || !name || !ingridients || !procedure || !category || !time)
    return res.status(400).json({message: 'Please provide all fields!'})

  const recipe = await Recipe.findById(id).exec()

  if (!recipe) return res.status(400).json({message: 'Recipe not found!'})

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
  if (!id) return res.status(400).json({message: 'Recipe ID is required'})

  const recipe = await Recipe.findById(id)
  if (!recipe) return res.status(400).json({message: 'Recipe not found'})

  const deleted = recipe.deleteOne()
  const message = `Recipe for ${deleted.name} with ID: ${deleted._id}, has been deleted`
  res.json(message)
}


module.exports = {
  getRecipes,
  getUserRecipes,
  likeRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getSingleRecipe,
}  