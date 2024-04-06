import { RecipeModel } from '../models';
import { Recipe } from '../models/recipe.model';
import { AppError , cloudinary } from '../utils';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { databaseResponseTimeHistogram } from '../utils/metrics';

const getUserRecipes = async (user_id: string, limit: number, skip: number ) => {
  const metricsLabels = { operation: 'findUserRecipes' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const recipes = await RecipeModel.find({ user_id }).sort({ createdAt: - 1 }).limit(limit).skip(skip).exec();
  //   timer({ ...metricsLabels, success: 'true' });
  //   return recipes;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false);
  // }

  const recipes = await RecipeModel.find({ user: user_id })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();
    
  return recipes;
}

const getAllRecipes = async (limit: number, skip: number) => {
  const metricsLabels = { operation: 'getAllRecipes' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const recipes = await RecipeModel.find({}).sort({ createdAt: - 1 }).limit(limit).skip(skip).exec();
  //   timer({ ...metricsLabels, success: 'true' });
  //   return recipes;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false);
  // }

  const recipes = await RecipeModel.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .exec();

  return recipes;
}

const findRecipeById = async (id: string) => {
  const metricsLabels = { operation: 'findRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const recipe = await RecipeModel.findById(id);
  //   timer({ ...metricsLabels, success: 'true' });
  //   return recipe;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false);
  // }

  const recipe = await RecipeModel.findById(id);
  return recipe;
}

const totalRecipes = async () => {
  const metricsLabels = { operation: 'countDocuments' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const count = await RecipeModel.estimatedDocumentCount({});
  //   timer({ ...metricsLabels, success: 'true' });
  //   return count;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false);
  // }

  const count = await RecipeModel.estimatedDocumentCount({});
  return count;
}

const createRecipe = async (data: Recipe) => {
  const metricsLabels = { operation: 'createRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const recipe = new RecipeModel(data);
  //   await recipe.save();
  //   timer({ ...metricsLabels, success: 'true' });
  //   return recipe;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false);
  // }

  const recipe = new RecipeModel(data);
  await recipe.save();
  return recipe;
}

const updateRecipe = async (
  query: FilterQuery<Recipe>, 
  update: UpdateQuery<Recipe>, 
  options: QueryOptions
) => {
  const metricsLabels = { operation: 'updateRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const result = await RecipeModel.findOneAndUpdate(query, update, options);
  //   timer({ ...metricsLabels, success: 'true' });
  //   return result;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   throw new AppError('Internal Server Error', 500, 'Something went wrong', false);
  // }

  const recipe = await RecipeModel.findOneAndUpdate(query, update, options);
  return recipe;
}

const deleteRecipe = async (id: string, public_id: string) => {
  const metricsLabels = { operation: 'deleteRecipe' }
  const timer = databaseResponseTimeHistogram.startTimer();
  // try {
  //   const delete_from_cloud = cloudinary.uploader.destroy(public_id);
  //   const delete_from_db = RecipeModel.findByIdAndDelete(id);
  //   await Promise.all([delete_from_cloud, delete_from_db]);
  //   timer({ ...metricsLabels, success: 'true' });
  //   return true;
  // } catch (error) {
  //   timer({ ...metricsLabels, success: 'false' });
  //   return false;
  // }

  const delete_from_cloud = cloudinary.uploader.destroy(public_id);
  const delete_from_db = RecipeModel.findByIdAndDelete(id);
  await Promise.all([delete_from_cloud, delete_from_db]);
  return true;
}

export default {
  deleteRecipe,
  updateRecipe, 
  getAllRecipes, 
  getUserRecipes, 
  createRecipe, 
  totalRecipes, 
  findRecipeById,
}
