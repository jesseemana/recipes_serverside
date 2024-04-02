import { Request, Response } from 'express';
import { RecipeService, UserService } from '../services';
import { AppError, uploadPicture } from '../utils';
import { CreateRecipeInput, GetRecipeParams, UpdateRecipeInput, } from '../schema/recipe.schema';

const ITEMS_PER_PAGE = 20;

const getAllRecipesHandler = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE; // starting index of every page
  const count = await RecipeService.totalRecipes();

  const found_recipes = await RecipeService.getAllRecipes(ITEMS_PER_PAGE, skip);
  if (!found_recipes.length) return res.status(404).send('No recipes found.');

  const recipes = await Promise.all(found_recipes.map(async(recipe) => {
    const user = await UserService.findUserById(String(recipe.user));
    if (!user) {
      return res.status(404).send(`User doesn't have any recipes.`);
    }

    return { 
      ...recipe, 
      username: `${user.first_name} ${user.last_name}`,
    }
  }));

  return res.status(200).json({
    recipes: recipes,
    pagination: {
      page: page,
      total_pages: Math.ceil(count / ITEMS_PER_PAGE),
    }
  });
}


const getUserRecipesHandler = async (
  req: Request<GetRecipeParams['params'], {}, {}>, 
  res: Response
) => {
  const { user_id } = req.params;

  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE; // starting index of every page
  const total = await RecipeService.totalRecipes();

  const user = await UserService.findUserById(user_id);
  if (!user) return res.status(404).send('User not found.');
  const recipes = await RecipeService.getUserRecipes(user_id, ITEMS_PER_PAGE, skip);
  if (!recipes.length) {
    return res.status(404).send(`User doesn't have any recipes..`);
  }

  const full_name = `${user.first_name} ${user.last_name}`;

  return res.status(200).json({ 
    recipes: recipes, 
    full_name: full_name, 
    pagination: {
      page: page,
      total_pages: Math.ceil(total / ITEMS_PER_PAGE),
    }
  });
}


const getSingleRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, {}>, 
  res: Response
) => {
  const { id } = req.params;

  const recipe = await RecipeService.findRecipeById(id);
  if (!recipe) return res.status(404).send('Recipe not found.');
  const user = await UserService.findUserById(String(recipe.user));
  if (!user) return res.status(404).send('User not found.');

  const owner = `${user.first_name} ${user.last_name}`;
  
  return res.status(200).json({ recipe, owner, });
}


const createRecipeHandler = async (
  req: Request<{}, {}, CreateRecipeInput>, 
  res: Response
) => {
  try {
    const body = req.body;
    const user_id = res.locals.user._id;
    if (req.file) {
      const response = await uploadPicture(req.file.path);
      const recipe = await RecipeService.createRecipe({ ...body, ...response, user: user_id });
      return res.status(201).send(`Recipe for ${recipe.name} has been created.`);
    }
    return res.status(400).send('Please provide a picture');
  } catch (error) {
    return res.status(500).send('Internal server error.');
  }
}


const updateRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, UpdateRecipeInput['body']>, 
  res: Response
) => {
  const { id } = req.params;
  const update_data = req.body;
  const user = String(res.locals.user._id);
  
  const recipe = await RecipeService.findRecipeById(id);
  if (!recipe) return res.status(404).send('Recipe not found.');

  if (String(recipe.user) !== user) {
    return res.status(401).send('User cannot make this operation.');
  }

  const updated_recipe = await RecipeService.updateRecipe({ _id: id }, update_data, { new: true });

  return res.status(200).send(updated_recipe);
}


const deleteRecipeHandler = async (
  req: Request<UpdateRecipeInput['params'], {}, {}>, 
  res: Response
) => {
  const { id } = req.params;
  const user = String(res.locals.user._id);
  
  const recipe = await RecipeService.findRecipeById(id);
  if (!recipe) return res.status(404).send('Recipe not found.');

  if (String(recipe.user) !== user) {
    return res.status(401).send('User cannot make this operation.');
  }

  const deleted = await RecipeService.deleteRecipe(id, recipe.cloudinary_id);
  if (deleted) return res.status(200).send('Recipe has been deleted!');

  return res.status(400).send('Failed to delete recipe.');
}


export default {
  getAllRecipesHandler,
  getUserRecipesHandler,
  getSingleRecipeHandler,
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
}
