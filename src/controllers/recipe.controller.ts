import cloudinary from '../utils/cloudinary'
import { Request, Response } from 'express'
import { createRecipe, deleteRecipe, findRecipeById, updateRecipe } from '../services/recipe.service'
import { CreateRecipeInput, UpdateRecipeInput } from '../schema/recipe.schema'
import log from '../utils/logger'
import { AppError } from '../utils/errors'


export const createRecipeHandler = async (
  req: Request<{}, {}, CreateRecipeInput>, 
  res: Response
) => {
  const body = req.body
  const user_id = res.locals.user._id

  log.info(req.file)
  const picture = req.file
  log.info(String(picture?.buffer))
  const response =  await cloudinary.uploader.upload(String(picture?.buffer))
  const picture_path =  response.url
  const cloudinary_id = response.public_id

  const recipe = await createRecipe({ ...body, picture_path, cloudinary_id, user: user_id })

  if (recipe) {
    return res.status(201).send(`Recipe for ${recipe.name} created succesfully.`)
  } else {
    res.status(400).send('Invalid data received.')
  }
}


export const updateRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, UpdateRecipeInput['body']>, 
  res: Response
) => {
  const update = req.body
  const { id } = req.params
  const user_id = res.locals.user._id
  
  const recipe = await findRecipeById(id)
  if (!recipe) {
    throw new AppError('Not Found', 404, 'Recipe was not found', true)
  }

  if (String(recipe.user) !== user_id) return res.sendStatus(403)

  const updated_recipe = await updateRecipe({ id }, update, { new: true })

  res.send(updated_recipe)
}


export const deleteRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, {}>, 
  res: Response
) => {
  const { id } = req.params
  const user_id = res.locals.user._id
  
  const recipe = await findRecipeById(id)
  if (!recipe) {
    throw new AppError('Not Found', 404, 'Recipe was not found', true)
  }

  if (String(recipe.user) !== user_id) return res.sendStatus(403)

  await cloudinary.uploader.destroy(recipe.cloudinary_id) // delete from cloudinary
  await deleteRecipe(id) // delete from db
  const message = `Recipe has been deleted`

  res.send(message)
}
