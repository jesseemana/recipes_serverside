import { Request, Response } from 'express';
import { UserService, RecipeService } from '../services';
import { BookmarksInput } from '../schema/bookmarks.schema';


async function userBookmarksHandler(
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) {
  const { user_id } = req.params;

  const user = await UserService.findUserById(user_id);
  if (!user) return res.status(404).send('User not found.');

  const bookmarks = await Promise.all(user.bookmarks.map(async(bookmark) => {
    const recipe = await RecipeService.findRecipeById(bookmark);
    if (!recipe) return;
    return recipe;
  }));

  return res.status(200).send(bookmarks);
};


async function addBookmarkHandler(
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) {
  const { user_id, recipe_id } = req.params;

  const user = UserService.findUserById(user_id);
  const recipe = RecipeService.findRecipeById(recipe_id);
  
  const [found_user, found_recipe] = await Promise.all([user, recipe]);
  if (!found_user) return res.status(404).send('User not found.');
  if (!found_recipe) return res.status(404).send('Recipe not found.');

  const bookmarked = found_user.bookmarks.find(bookmark => bookmark === recipe_id);
  if (bookmarked) return res.status(400).send('Recipe already bookmarked.');

  found_user.bookmarks.push(recipe_id);

  await found_user.save();

  return res.status(200).send('Bookmark added.');
};


async function removeBookmarkHandler(
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) {
  const { user_id, recipe_id } = req.params;

  const user = UserService.findUserById(user_id);
  const recipe = RecipeService.findRecipeById(recipe_id);

  const [found_user, found_recipe] = await Promise.all([user, recipe]);
  if (!found_user) return res.status(404).send('User not found.');
  if (!found_recipe) return res.status(404).send('Recipe not found.');

  const bookmarked = found_user.bookmarks.find(bookmark => bookmark === recipe_id);
  if (!bookmarked) return res.status(400).send('Recipe is not bookmarked.');

  found_user.bookmarks = [...(found_user.bookmarks.filter(bookmark => bookmark !== recipe_id))];
  
  await found_user.save();

  return res.status(200).send('Bookmark removed.');
};


export default {
  removeBookmarkHandler, 
  addBookmarkHandler, 
  userBookmarksHandler, 
};
