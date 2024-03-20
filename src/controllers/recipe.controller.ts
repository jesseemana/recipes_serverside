import { Request, Response } from 'express';
import { RecipeService } from '../services';
import { AppError, uploadPicture } from '../utils';
import { CreateRecipeInput, UpdateRecipeInput, } from '../schema/recipe.schema';


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
    // throw new AppError('Internal Server Error', 500, 'Something went wrong', false)
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
    // throw new AppError('Not Found', 404, 'Recipe not found', true);

  if (String(recipe.user) !== user) 
    return res.status(401).send('User cannot make this operation.');
    // throw new AppError('Unauthorized', 401, 'User cannot this operation', true);

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
    // throw new AppError('Not Found', 404, 'Recipe not found', true);

  if (String(recipe.user) !== user) 
    return res.status(401).send('User cannot make this operation.');
    // throw new AppError('Unauthorized', 401, 'User cannot this operation', true);

  await RecipeService.deleteRecipe(id, recipe.cloudinary_id);

  return res.status(200).send('Recipe has been deleted!');
}


export default {
  createRecipeHandler,
  updateRecipeHandler,
  deleteRecipeHandler,
}
