import { Request, Response } from 'express'
import { findAllRecipes, findRecipeById, findRecipeByUser, totalRecipes } from '../services/recipe.service'
import { findUserById } from '../services/user.service'
import { UpdateRecipeInput } from '../schema/recipe.schema'
import { AppError } from '../utils/errors'

export const getAllRecipesHandler = async (req: Request, res: Response) => {
  const { page } = req.query

  // pagination setup
  const LIMIT = 20
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  const total = await totalRecipes()

  const recipes = await findAllRecipes().lean().sort({ createdAt: -1 }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) throw new AppError('Not Found', 404, 'There are no recipes found here.', true)

  // attaching a owner to a recipe
  const recipes_with_user = await Promise.all(recipes.map(async (recipe) => {
    const user = await findUserById(String(recipe.user)).lean().exec()
    if (!user) throw new AppError('Not Found', 404, `User doesn't have any recipes.`, true) 
    return { ...recipe, username: `${user?.first_name} ${user?.last_name}` }
  }))

  res.status(200).json({
    recipes: recipes_with_user,
    current_page: Number(page),
    total_pages: Math.ceil(total / LIMIT)
  })
}


export const getUserRecipesHandler = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const LIMIT = 20
  const startIndex = (Number(req.query.page) - 1) * LIMIT // starting index of every page
  // const total = await totalRecipes()

  if (!user_id) throw new AppError('Bad Request', 400, `Please provide a user id.`, true) 
  
  const recipes = await findRecipeByUser({ user_id }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) throw new AppError('Not Found', 404, `User doesn't have any recipes.`, true)

  const owner = await findUserById(user_id)
  if (!owner) throw new AppError('Not Found', 404, `User doesn't not exist.`, true) 

  const full_name = `${owner.first_name} ${owner.last_name}`

  res.status(200).json({ recipes, full_name })
}


export const getSingleRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, {}>, 
  res: Response
) => {
  const { id } = req.params

  const recipe = await findRecipeById(id)
  if (!recipe) throw new AppError('Not Found', 404, `Recipe doesn't exist.`, true) 
  const user = await findUserById(String(recipe.user))
  if (!user) throw new AppError('Not Found', 404, `User doesn't exist.`, true) 

  const owner = `${user.first_name} ${user.last_name}`

  res.status(200).json({ recipe, owner, })
}
