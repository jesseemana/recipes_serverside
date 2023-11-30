import { Request, Response } from 'express'
import { findAllRecipes, findRecipeById, findRecipeByUser, totalRecipes } from '../services/recipe.service'
import { findUserById } from '../services/user.service'
import { UpdateRecipeInput } from '../schema/recipe.schema'


export const getAllRecipesHandler = async (req: Request, res: Response) => {
  const { page } = req.query

  // pagination setup
  const LIMIT = 20
  const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
  const total = await totalRecipes()

  const recipes = await findAllRecipes().lean().sort({ createdAt: -1 }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) {
    return res.status(404).send('There are no recipes found')
  }

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


export const getUserRecipesHandler = async (req: Request, res: Response) => {
  const { user_id } = req.params
  const LIMIT = 20
  const startIndex = (Number(req.query.page) - 1) * LIMIT // starting index of every page
  // const total = await totalRecipes()

  if (!user_id) return res.status(400).send('Provide a user id')
  
  const recipes = await findRecipeByUser({ user_id }).limit(LIMIT).skip(startIndex)
  if (!recipes?.length) {
    return res.status(404).send(`User doesn't have any recipes`)
  }

  const owner = await findUserById(user_id)
  if (!owner) {
    return res.send('User not found')
  }

  const full_name = `${owner.first_name} ${owner.last_name}`

  res.status(200).json({ recipes, full_name })
}


export const getSingleRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, {}>, 
  res: Response
) => {
  const { id } = req.params

  const recipe = await findRecipeById(id)
  if (!recipe) { return res.sendStatus(404) }
  const user = await findUserById(String(recipe.user))
  if (!user) { return res.sendStatus(404) }

  const owner = `${user.first_name} ${user.last_name}`

  res.status(200).json({ recipe, owner, })
}
