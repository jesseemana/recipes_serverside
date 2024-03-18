import { Request, Response } from 'express';
import { AppError } from '../utils';
import { UserService, RecipeService } from '../services';
import { UpdateRecipeInput } from '../schema/recipe.schema';

const ITEMS_PER_PAGE = 20;

const getAllRecipesHandler = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const start_index = (Number(page) - 1) * ITEMS_PER_PAGE; // starting index of every page
  const count = await RecipeService.totalRecipes();

  const recipes = await RecipeService.getAllRecipes(ITEMS_PER_PAGE, start_index);
  if (!recipes.length) return res.status(404).send('No recipes found.');
    // throw new AppError('Not Found', 404, 'There are no recipes found. Create some.', true);

  const recipes_with_user = await Promise.all(recipes.map(async (recipe) => {
    const user = await UserService.findUserById(String(recipe.user));
    if (!user) return res.status(404).send(`User doesn't have any recipes.`);
      // throw new AppError('Not Found', 404, `User doesn't have any recipes.`, true);

    return { 
      ...recipe, 
      username: `${user.first_name} ${user.last_name}`,
    }
  }));

  return res.status(200).json({
    recipes: recipes_with_user,
    pagination: {
      page: Number(page),
      total_pages: Math.ceil(count / ITEMS_PER_PAGE),
    }
  });
}


const getUserRecipesHandler = async (req: Request, res: Response) => {
  const { user_id } = req.params;

  const page = req.query.page || 1;
  const start_index = (Number(page) - 1) * ITEMS_PER_PAGE; // starting index of every page
  const total = await RecipeService.totalRecipes();

  const user = await UserService.findUserById(user_id);
  if (!user) return res.status(404).send('User not found.');
    // throw new AppError('Not Found', 404, `User not found.`, true); 
    
  const recipes = await RecipeService.getUserRecipes(user_id, ITEMS_PER_PAGE, start_index);
  if (!recipes.length) return res.status(404).send(`User doesn't have any recipes..`);
    // throw new AppError('Not Found', 404, `User doesn't have any recipes..`, true);
  const full_name = `${user.first_name} ${user.last_name}`;

  return res.status(200).json({ 
    recipes: recipes, 
    full_name: full_name, 
    pagination: {
      page: Number(page),
      tota_pages: Math.ceil(total / ITEMS_PER_PAGE),
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
    // throw new AppError('Not Found', 404, `Recipe not found.`, true) ;
  const user = await UserService.findUserById(String(recipe.user));
  if (!user) return res.status(404).send('User not found.');
    // throw new AppError('Not Found', 404, `User not found.`, true) ;
  const owner = `${user.first_name} ${user.last_name}`;
  
  return res.status(200).json({ recipe, owner, });
}

export default {
  getAllRecipesHandler,
  getUserRecipesHandler,
  getSingleRecipeHandler,
}
