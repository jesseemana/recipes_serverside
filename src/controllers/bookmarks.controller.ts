import { Request, Response } from 'express';
import { HandleBookmarksInput } from '../schema/bookmarks.schema';
import { findRecipeById } from '../services/recipe.service';
import { findUserById } from '../services/user.service';
import { AppError } from '../utils/errors';


export const userBookmarksHandler = async (
  req: Request<HandleBookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id } = req.params;

  const user = await findUserById(user_id);
  if (!user) {
    throw new AppError('Not Found', 404, 'User not found', true);
  }

  const bookmarks = [];

  for (const bookmark of user.bookmarks) {
    const recipe = await findRecipeById(bookmark);
    if (recipe) {
      bookmarks.push(recipe);
    }
  }

  res.status(200).send(bookmarks);
};


export const addBookmarkHandler = async (
  req: Request<HandleBookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id, recipe_id } = req.params;

  const user = await findUserById(user_id);
  const recipe = await findRecipeById(recipe_id);

  if (!recipe || !user) {
    throw new AppError('Not Found', 404, 'User or Recipe does not exist', true);
  }

  if (user.bookmarks.includes(recipe_id)) {
    throw new AppError('Bad Request', 400, 'Recipe is already boomarked', true);
  }

  user.bookmarks.push(recipe_id);

  await user.save();

  res.status(200).send('Recipe added to bookmarks');
};


export const removeBookmarkHandler = async (
  req: Request<HandleBookmarksInput, {}, {}>, 
  res: Response
) => {
  const { user_id, recipe_id } = req.params;

  const user = await findUserById(user_id);
  const recipe = await findRecipeById(recipe_id);

  if (!recipe || !user) {
    throw new AppError('Not Found', 404, 'User or User does not exist', true)
  }

  if (!user.bookmarks.includes(recipe_id)) {
    throw new AppError('Bad Request', 400, 'Recipe is not boomarked', true);
  }

  user.bookmarks = [ ...(user.bookmarks.filter((bookmark) => bookmark.toString() !== recipe_id)) ];

  await user.save();

  res.status(200).send(`Recipe for ${recipe.name} removed from bookmarks`);
};
