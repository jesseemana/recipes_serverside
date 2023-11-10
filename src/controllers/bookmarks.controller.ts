import { Request, Response } from 'express';
import { CreateBookmarksInput } from '../schema/bookmarks.schema';
import { findRecipeById } from '../services/recipe.service';
import { findUserById } from '../services/user.service';
import log from '../utils/logger';


const userBookmarksHandler = async (req: Request<CreateBookmarksInput, {}, {}>, res: Response) => {
  const { user_id } = req.params;

  const user = await findUserById(user_id);

  if (!user) return res.status(401).send('User not found');

  const user_bookmarks = user.bookmarks;

  const bookmarks = [];

  for (const bookmark of user_bookmarks) {
    const recipe = await findRecipeById(bookmark);
    if (recipe) {
      bookmarks.push(recipe);
    }
  }

  res.status(200).send(bookmarks);
};


const addBookmarkHandler = async (req: Request<CreateBookmarksInput, {}, {}>, res: Response) => {
  const { user_id, recipe_id } = req.params;
  const user = await findUserById(user_id);
  const recipe = await findRecipeById(recipe_id);

  if (!recipe || !user) return res.sendStatus(404);

  const bookmarks = user.bookmarks;

  if (bookmarks.includes(recipe_id)) {
    return res.status(400).send('Recipe already bookmarked');
  }

  bookmarks.push(recipe_id);

  await user.save();

  res.status(200).send('Recipe added to bookmarks');
};


const removeBookmarkHandler = async (req: Request<CreateBookmarksInput, {}, {}>, res: Response) => {
  const { user_id, recipe_id } = req.params;
  const user = await findUserById(user_id);
  const recipe = await findRecipeById(recipe_id);

  if (!recipe || !user) return res.sendStatus(404);
  
  const bookmarks = user.bookmarks;
  log.info(`Current bookmarks: ${bookmarks}`);

  if (!bookmarks.includes(recipe_id)) {
    return res.status(400).send('Recipe not bookmarked');
  }

  user.bookmarks = [ ...(bookmarks.filter((bookmark) => bookmark.toString() !== recipe_id)) ];
  log.info(`Updated bookmarks: ${user.bookmarks}`);

  await user.save();

  res.status(200).send(`Recipe for ${recipe.name} removed from bookmarks`);
};


export {
  userBookmarksHandler,
  addBookmarkHandler,
  removeBookmarkHandler,
};
