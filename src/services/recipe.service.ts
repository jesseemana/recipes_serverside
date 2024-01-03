import RecipeModel, { Recipe } from '../models/recipe.model'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import cloudinary from '../utils/cloudinary'
import { databaseResponseTimeHistogram } from '../utils/metrics'
import { AppError } from '../utils/errors'

const getUserRecipes = ({ user_id }: {user_id: string}) => {
  const metricsLabels = { operation: 'findUserRecipes' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const result = await RecipeModel.find({ user_id })
  //   timer({...metricsLabels, success: 'true'})
  //   return result
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  return RecipeModel.find({ user_id })
}

const getAllRecipes = () => {
  const metricsLabels = { operation: 'getAllRecipes' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const result = await RecipeModel.find({})
  //   timer({...metricsLabels, success: 'true'})
  //   return result
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  return RecipeModel.find({})
}

 const findRecipeById = async (id: string) => {
  const metricsLabels = { operation: 'findRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const result = await RecipeModel.findById(id)
  //   timer({...metricsLabels, success: 'true'})
  //   return result
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  return await RecipeModel.findById(id)
}

 const totalRecipes = async () => {
  const metricsLabels = { operation: 'countDocuments' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const result = await RecipeModel.estimatedDocumentCount({})
  //   timer({...metricsLabels, success: 'true'})
  //   return result
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  return await RecipeModel.estimatedDocumentCount({})
}

 const createRecipe = async (data: Recipe) => {
  const metricsLabels = { operation: 'createRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const result = await RecipeModel.create(data)
  //   timer({...metricsLabels, success: 'true'})
  //   return result
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  return await RecipeModel.create(data)
}

 const updateRecipe = async (
  query: FilterQuery<Recipe>, 
  update: UpdateQuery<Recipe>, 
  options: QueryOptions
) => {
  const metricsLabels = { operation: 'updateRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const result = await RecipeModel.findOneAndUpdate(query, update, options)
  //   timer({...metricsLabels, success: 'true'})
  //   return result
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  return await RecipeModel.findOneAndUpdate(query, update, options)
}

 const deleteRecipe = async (id: string, public_id: string): Promise<string> => {
  const metricsLabels = { operation: 'deleteRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer()
  // try {
  //   const delete_from_cloud = cloudinary.uploader.destroy(public_id)
  //   const delete_from_db = RecipeModel.findByIdAndDelete(id)
  //   await Promise.all([cloudinary.uploader.destroy(public_id), RecipeModel.findByIdAndDelete(id)])
  //   timer({...metricsLabels, success: 'true'})
  //   return 'Recipe has been deleted successfully!'
  // } catch (error) {
  //   timer({...metricsLabels, success: 'false'})
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
  // }

  await Promise.all([cloudinary.uploader.destroy(public_id), RecipeModel.findByIdAndDelete(id)])
  return 'Recipe has been deleted successfully!'
}

export default {
  getUserRecipes, 
  getAllRecipes, 
  deleteRecipe,
  updateRecipe, 
  createRecipe, 
  totalRecipes, 
  findRecipeById
}
