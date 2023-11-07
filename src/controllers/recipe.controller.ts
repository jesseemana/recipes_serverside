import { Request, Response } from 'express'
// @ts-ignore
import cloudinary from '../utils/cloudinary'
import { findUserById } from '../services/user.service'
import { createRecipe, deleteRecipe, findAllRecipes, findRecipeById, findRecipeByUser, totalRecipes } from '../services/recipe.service'
import { CreateRecipeInput, DeleteRecipeInput, UpdateRecipeInput } from '../schema/recipe.schema'

const getAllRecipesHandler = async (req: Request, res: Response) => {
  const { page } = req.query

  // PAGINATION SETUP
  const LIMIT = 20
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  const total = await totalRecipes()

  const recipes = await findAllRecipes().find().lean().sort({ createdAt: -1 }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) return res.status(400).json({ 'message': 'There are no recipes found' })

  // ATTACHING A SPECIFIC USER TO A RECIPE THEY CREATED 
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
  // const total = await Recipe.countDocuments({})

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
  if (!recipe) return res.status(400).json({ 'message': 'Recipe not found' })

  const user = await findUserById(String(recipe.user)).lean().exec()
  if (!user) return res.send('User not found')

  const owner = `${user.first_name} ${user.last_name}`

  res.status(200).json({ recipe, owner, })
}


const createRecipeHandler = async (req: Request<{}, {}, CreateRecipeInput>, res: Response) => {
  const { user, name, ingridients, category, time, procedure } = req.body

  const response = await cloudinary.uploader.upload(req.file?.path)

  const recipe = {
    user,
    name,
    time,
    category,
    procedure,
    ingridients,
    picture_path: response.secure_url,
    cloudinary_id: response.public_id,
  }

  await createRecipe(recipe)

  if (recipe) {
    return res.status(201).send(`Recipe for ${recipe.name} created succesfully.`)
  } else {
    res.status(400).send('Invalid data received.')
  }
}


const updateRecipeHandler = async (req: Request<{}, {}, UpdateRecipeInput>, res: Response) => {
  const { id, name, ingridients, procedure, category, time } = req.body

  const recipe = await findRecipeById(id).exec()
  if (!recipe) return res.status(400).json({ 'message': 'Recipe not found!' })

  recipe.time = time
  recipe.name = name
  recipe.category = category
  recipe.procedure = procedure
  recipe.ingridients = ingridients

  const updated_recipe = await recipe.save()

  res.status(201).json(updated_recipe)
}


const deleteRecipeHandler = async (req: Request<{}, {}, DeleteRecipeInput>, res: Response) => {
  const { id } = req.body
  
  const recipe = await findRecipeById(id)
  if (!recipe) return res.status(400).json({ 'message': 'Recipe not found' })

  await cloudinary.uploader.destroy(recipe.cloudinary_id) // delete from cloudinary
  await deleteRecipe(id) // delete from db
  const message = `Recipe has been deleted`

  res.send(message)
}


export {
  getAllRecipesHandler,
  getUserRecipesHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
  getSingleRecipeHandler,
}
