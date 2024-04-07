import { Request, Response } from 'express';
import { UserService, RecipeService } from '../services';
import { BookmarksInput } from '../schema/bookmarks.schema';


const userBookmarksHandler = async (
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id } = req.params;

  const user = await UserService.findUserById(user_id);
  if (!user) {
    return res.status(404).send('User not found.');
  }

  const bookmarks = [];

  for (const bookmark of user.bookmarks) {
    const recipe = await RecipeService.findRecipeById(bookmark);
    if (recipe) { 
      bookmarks.push(recipe); 
    }
  }

  return res.status(200).send(bookmarks);
};


const addBookmarkHandler = async (
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id, recipe_id } = req.params;

  const user = UserService.findUserById(user_id);
  const recipe = RecipeService.findRecipeById(recipe_id);
  
  const [found_user, found_recipe] = await Promise.all([user, recipe]);

  if (!found_user || !found_recipe) {
    return res.status(404).send('User or recipe not found.');
  }

  if (found_user.bookmarks.includes(recipe_id)) {
    return res.status(400).send('Recipe already bookmarked.');
  }

  found_user.bookmarks.push(recipe_id);

  await found_user.save();

  return res.status(200).send(`${found_recipe.name} recipe added to bookmarks.`);
};


const removeBookmarkHandler = async (
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id, recipe_id } = req.params;

  const user = UserService.findUserById(user_id);
  const recipe = RecipeService.findRecipeById(recipe_id);

  const [found_user, found_recipe] = await Promise.all([user, recipe]);

  if (!found_user || !found_recipe) {
    return res.status(404).send('User or recipe not found.');
  }

  if (!found_user.bookmarks.includes(recipe_id)) {
    return res.status(400).send(`Recipe is not bookmarked.`);
  }

  found_user.bookmarks = [ ...(found_user.bookmarks.filter((bookmark) => bookmark !== recipe_id)) ];

  await found_user.save();

  return res.status(200).send(`${found_recipe.name} recipe removed from bookmarks.`);
};


export default {
  removeBookmarkHandler, 
  addBookmarkHandler, 
  userBookmarksHandler, 
};
