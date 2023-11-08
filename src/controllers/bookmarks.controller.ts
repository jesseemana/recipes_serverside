import { Request, Response } from 'express';
import { findUserById } from '../services/user.service';
import { findRecipeById } from '../services/recipe.service';


const userBookmarksHandler = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).send('Provide a user id');

  const user = await findUserById(id);

  if (!user) return res.status(401).send('user not found');

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


const addBookmarkHandler = async (req: Request, res: Response) => {
  const { user_id, recipe_id } = req.params;
  if (!recipe_id || !user_id)
    return res.status(400).send('Provide recipe and user id');

  const recipe = await findRecipeById(recipe_id);

  if (!recipe) return res.status(404).send('Recipe not found');

  const user = await findUserById(user_id);

  if (!user) return res.status(404).send('User not found');

  const bookmarks = user.bookmarks;

  if (bookmarks.includes(recipe_id))
    return res.status(400).send('Recipe already bookmarked');

  bookmarks.push(recipe_id);

  await user.save();

  res.status(200).send('Recipe added to bookmarks');
};


const removeBookmarkHandler = async (req: Request, res: Response) => {
  const { user_id, recipe_id } = req.params;
  if (!recipe_id || !user_id)
    return res.status(400).send('Provide recipe and user id');

  const recipe = await findRecipeById(recipe_id);

  if (!recipe) return res.status(404).send('Recipe not found');

  const user = await findUserById(user_id);

  if (!user) return res.status(404).send('User not found');

  const bookmarks = user.bookmarks;
  console.log(bookmarks);

  if (!bookmarks.includes(recipe_id))
    return res.status(400).send('Recipe not bookmarked');

  user.bookmarks = [ ...(bookmarks.filter((bookmark) => bookmark.toString() !== recipe_id)) ];
  console.log(user.bookmarks);

  await user.save();

  res.status(200).send(`Recipe for ${recipe.name} removed from bookmarks`);
};


export {
  userBookmarksHandler,
  addBookmarkHandler,
  removeBookmarkHandler,
};
