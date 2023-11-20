import RecipeModel, { Recipe } from '../models/recipe.model'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import cloudinary from '../utils/cloudinary'
import { CloudinaryResponse } from '../../types'

export const findAllRecipes = () => {
  return RecipeModel.find()
}

export const findRecipeById = (id: string) => {
  return RecipeModel.findById(id)
}

export const findRecipeByUser = ({ user_id }: { user_id: string }) => {
  return RecipeModel.find({ user_id })
}

export const totalRecipes = () => {
  return RecipeModel.countDocuments({})
}

export const createRecipe = (data: Recipe) => {
  return RecipeModel.create(data)
}

export const uploadPicture = async (file_path: string): Promise<CloudinaryResponse> => {
  const result = await cloudinary.uploader.upload(file_path)
  return { 
    picture_path: result.url, 
    cloudinary_id: result.public_id 
  }
}

export const updateRecipe = (
  query: FilterQuery<Recipe>, 
  update: UpdateQuery<Recipe>, 
  options: QueryOptions
) => {
  return RecipeModel.findOneAndUpdate(query, update, options)
}

export const deleteRecipe = async (id: string, public_id: string): Promise<string> => {
  await cloudinary.uploader.destroy(public_id)
  RecipeModel.findByIdAndDelete(id)
  return 'Recipe has been deleted successfully!'
}
