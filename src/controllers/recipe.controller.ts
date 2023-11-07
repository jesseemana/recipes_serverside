// @ts-ignore
import cloudinary from '../utils/cloudinary'
import { Request, Response } from 'express'
import { 
  createRecipe, 
  deleteRecipe, 
  findAllRecipes, 
  findRecipeById, 
  findRecipeByUser, 
  totalRecipes, 
  updateRecipe 
} from '../services/recipe.service'
import { findUserById } from '../services/user.service'
import { CreateRecipeInput, UpdateRecipeInput } from '../schema/recipe.schema'


const getAllRecipesHandler = async (req: Request, res: Response) => {
  const { page } = req.query

  // pagination setup
  const LIMIT = 20
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  const total = await totalRecipes()

  const recipes = await findAllRecipes().find().lean().sort({ createdAt: -1 }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) return res.status(400).json({ 'message': 'There are no recipes found' })

  // attaching a owner to a recipe
  const recipes_with_user = await Promise.all(recipes.map(async (recipe) => {
    const user = await findUserById(String(recipe.user)).lean().exec()
    if (!user) return res.send('Recipe with such user not found')
    return { ...recipe, username: `${user?.first_name} ${user?.last_name}` }
  }))

  res.status(200).json({
    recipes: recipes_with_user,
    current_page: Number(page),
    total_pages: Math.ceil(total / LIMIT)
  })
}


const getUserRecipesHandler = async (req: Request, res: Response) => {
  const { user } = req.params
  const LIMIT = 20
  const startIndex = (Number(req.query.page) - 1) * LIMIT // starting index of every page
  // const total = await totalRecipes()

  if (!user) return res.status(400).json({ 'message': 'Provide a user id' })
  
  const recipes = await findRecipeByUser({ user }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) return res.status(400).json({ 'message': `User doesn't have any recipes` })

  const owner = await findUserById(user)
  if (!owner) return res.send('User not found')

  const full_name = `${owner.first_name} ${owner.last_name}`

  res.status(200).json({ recipes, full_name })
}


const getSingleRecipeHandler = async (req: Request, res: Response) => {
  const { id } = req.params
  if (!id) return res.status(400).json({ 'message': 'Provide recipe id' })

  const recipe = await findRecipeById(id).lean().exec()
  if (!recipe) return res.sendStatus(404)

  const user = await findUserById(String(recipe.user)).lean().exec()
  if (!user) return res.sendStatus(404)

  const owner = `${user.first_name} ${user.last_name}`

  res.status(200).json({ recipe, owner, })
}


const createRecipeHandler = async (req: Request<{}, {}, CreateRecipeInput>, res: Response) => {
  const body = req.body
  const userId = res.locals.user._id

  const response = await cloudinary.uploader.upload(req.file?.path)
  const picture_path = response.secure_url as string
  const cloudinary_id = response.public_id as string

  const recipe = await createRecipe({...body, user: userId, picture_path, cloudinary_id})

  if (recipe) {
    return res.status(201).send(`Recipe for ${recipe.name} created succesfully.`)
  } else {
    res.status(400).send('Invalid data received.')
  }
}


const updateRecipeHandler = async (req: Request<UpdateRecipeInput['params'], {}, UpdateRecipeInput['body']>, res: Response) => {
  const update = req.body
  const recipeId = req.params.recipeId
  const userId = res.locals.user._id
  
  const recipe = await findRecipeById(recipeId)

  if (!recipe) return res.sendStatus(404)

  if (String(recipe.user) !== userId) return res.sendStatus(403)

  const updated_recipe = await updateRecipe({ recipeId }, update, { new: true })

  res.send(updated_recipe)
}


const deleteRecipeHandler = async (req: Request<UpdateRecipeInput['params'], {}, {}>, res: Response) => {
  const recipeId = req.params.recipeId
  const userId = res.locals.user._id
  
  const recipe = await findRecipeById(recipeId)

  if (!recipe) return res.sendStatus(404)

  if (String(recipe.user) !== userId) return res.sendStatus(403)

  await cloudinary.uploader.destroy(recipe.cloudinary_id) // delete from cloudinary
  await deleteRecipe(recipeId) // delete from db
  const message = `Recipe has been deleted`

  res.send(message)
}


export default {
  getAllRecipesHandler,
  getUserRecipesHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
  getSingleRecipeHandler,
}
