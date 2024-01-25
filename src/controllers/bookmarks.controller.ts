import { Request, Response } from 'express';
import { AppError } from '../utils';
import { UserService, RecipeService } from '../services';
import { BookmarksInput } from '../schema/bookmarks.schema';


const userBookmarksHandler = async (
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id } = req.params;

  const user = await UserService.findUserById(user_id);
  if (!user) return res.status(404).send('User Not Found.');
    // throw new AppError('Not Found', 404, 'User Not Found.', true);

  const bookmarks = [];

  for (const bookmark of user.bookmarks) {
    const recipe = await RecipeService.findRecipeById(bookmark);
    if (recipe) { bookmarks.push(recipe); }
  }

  res.status(200).send(bookmarks);
};


const addBookmarkHandler = async (
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id, recipe_id } = req.params;

  const found_user = UserService.findUserById(user_id);
  const found_recipe = RecipeService.findRecipeById(recipe_id);
  const [user, recipe] = await Promise.all([found_user, found_recipe]);
  if (!recipe || !user) { 
    return res.status(404).send('User/Recipe Not found.');
    // throw new AppError('Not Found', 404, 'User/Recipe Not found.', true);
  }

  if (user.bookmarks.includes(recipe_id)) {
    return res.status(400).send('Recipe Already Bookmarked');
    // throw new AppError('Bad Request', 400, 'Recipe Is Already Bookmarked', true);
  }

  user.bookmarks.push(recipe_id);
  await user.save();

  res.status(200).send('Recipe added to bookmarks');
};


const removeBookmarkHandler = async (
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id, recipe_id } = req.params;

  const found_user = UserService.findUserById(user_id);
  const found_recipe = RecipeService.findRecipeById(recipe_id);
  const [user, recipe] = await Promise.all([found_user, found_recipe]);
  if (!recipe || !user) {
    return res.status(404).send('User/Recipe Not found.');
    // throw new AppError('Not Found', 404, 'User/Recipe Not found.', true);
  }

  if (!user.bookmarks.includes(recipe_id)) {
    return res.status(400).send(`Recipe Is Not Bookmarked`);
    // throw new AppError('Bad Request', 400, `Recipe Is Not Bookmarked`, true);
  }

  user.bookmarks = [ ...(user.bookmarks.filter((bookmark) => bookmark !== recipe_id)) ];
  await user.save();

  res.status(200).send(`${recipe.name} recipe removed from bookmarks`);
};


export default {
  addBookmarkHandler, 
  userBookmarksHandler, 
  removeBookmarkHandler, 
};
