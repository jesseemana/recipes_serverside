import RecipeModel, { Recipe } from "../models/recipe.model"

export const findAllRecipes = () => {
  return RecipeModel.find()
}

export const findRecipeById = (id: string) => {
  return RecipeModel.findById(id)
}

export const findRecipeByUser = ({ user }: { user: string }) => {
  return RecipeModel.find({ user })
}

export const totalRecipes = () => {
  return RecipeModel.countDocuments({})
}

export const createRecipe = (data: Partial<Recipe>) => {
  return RecipeModel.create(data)
}

export const updateRecipe = () => {
  return RecipeModel.findOneAndUpdate()
}

export const deleteRecipe = (id: string) => {
  return RecipeModel.findByIdAndDelete(id)
}
