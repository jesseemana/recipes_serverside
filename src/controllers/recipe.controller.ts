import { Request, Response } from 'express'
import { createRecipe, deleteRecipe, findRecipeById, updateRecipe, uploadPicture } from '../services/recipe.service'
import { CreateRecipeInput, UpdateRecipeInput, createRecipeSchema } from '../schema/recipe.schema'
import { AppError } from '../utils/errors'


export const createRecipeHandler = async (
  req: Request<{}, {}, CreateRecipeInput>, 
  res: Response
) => {
  const body = createRecipeSchema.parse(req.body)
  const user_id = res.locals.user._id

  try {
    if (req.file) {
      const response = await uploadPicture(req.file.path)
      const recipe = await createRecipe({ ...body, ...response, user: user_id }) 
      return res.status(201).send(`Recipe for ${recipe.name} created succesfully.`)
    }
  } catch (error) {
    throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  }
}


export const updateRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, UpdateRecipeInput['body']>, 
  res: Response
) => {
  const { id } = req.params
  const update_data = req.body
  const user_id = res.locals.user._id
  
  const recipe = await findRecipeById(id)

  if (!recipe) throw new AppError('Not Found', 404, 'Recipe was not found', true)

  if (String(recipe.user) !== String(user_id)) {
    throw new AppError('Unauthorized', 401, 'User is not allowed to make this operation', true)
  }

  const updated_recipe = await updateRecipe({ _id: id }, update_data, { new: true })

  res.status(200).send(updated_recipe)
}


export const deleteRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, {}>, 
  res: Response
) => {
  const { id } = req.params
  const user_id = res.locals.user._id
  
  const recipe = await findRecipeById(id)

  if (!recipe) throw new AppError('Not Found', 404, 'Recipe was not found', true)

  if (String(recipe.user) !== user_id) 
    throw new AppError('Unauthorized', 401, 'User is not allowed to make this operation', true)

  const message = await deleteRecipe(id, recipe.cloudinary_id)

  res.status(200).send(message)
}
