import { Request, Response } from 'express'
import { getAllRecipes, findRecipeById, getUserRecipes, totalRecipes } from '../services/recipe.service'
import { findUserById } from '../services/user.service'
import { UpdateRecipeInput } from '../schema/recipe.schema'
import { AppError } from '../utils/errors'

const ITEMS_PER_PAGE = 20

export const getAllRecipesHandler = async (req: Request, res: Response) => {
  const page = req.query.page || 1
  const start_index = (Number(page) - 1) * ITEMS_PER_PAGE // starting index of every page
  const count = totalRecipes()

  const all_recipes = getAllRecipes().sort({ createdAt: -1 }).limit(ITEMS_PER_PAGE).skip(start_index)
  const [total, recipes] = await Promise.all([count, all_recipes])

  if (!recipes?.length) 
    throw new AppError('Not Found', 404, 'There are no recipes found. Create some.', true)

  const recipes_with_user = await Promise.all(recipes.map(async (recipe) => {
    const user = await findUserById(String(recipe.user)).lean().exec()
    if (!user) throw new AppError('Not Found', 404, `User doesn't have any recipes.`, true) 
    return { ...recipe, username: `${user?.first_name} ${user?.last_name}` }
  }))

  res.status(200).json({
    recipes: recipes_with_user,
    pagination: {
      page: Number(page),
      total_pages: Math.ceil(total / ITEMS_PER_PAGE)
    }
  })
}


export const getUserRecipesHandler = async (req: Request, res: Response) => {
  const { user_id } = req.params

  const page = req.query.page || 1
  const start_index = (Number(page) - 1) * ITEMS_PER_PAGE // starting index of every page
  const count = totalRecipes()

  if (!user_id) throw new AppError('Bad Request', 400, `Please provide a user id.`, true) 
  
  const user_recipes = getUserRecipes({ user_id }).sort({ createdAt: -1 }).limit(ITEMS_PER_PAGE).skip(start_index)
  const [total, recipes] = await Promise.all([count, user_recipes])

  if (!recipes?.length) 
    throw new AppError('Not Found', 404, `User doesn't have any recipes.`, true)

  const owner = await findUserById(user_id)
  if (!owner) throw new AppError('Not Found', 404, `User doesn't not exist.`, true) 

  const full_name = `${owner.first_name} ${owner.last_name}`

  res.status(200).json({ 
    recipes: recipes, 
    full_name: full_name, 
    pagination: {
      page: Number(page),
      tota_pages: Math.ceil(total / ITEMS_PER_PAGE)
    }
  })
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
