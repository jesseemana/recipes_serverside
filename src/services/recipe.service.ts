import RecipeModel, { Recipe } from '../models/recipe.model'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import cloudinary from '../utils/cloudinary'

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

export const uploadPicture = async (picture: string) => {
  const result = await cloudinary.uploader.upload(picture)
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

export const deleteRecipe = (id: string) => {
  return RecipeModel.findByIdAndDelete(id)
}
