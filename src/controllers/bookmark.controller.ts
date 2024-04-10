import { Request, Response } from 'express';
import { BookmarksInput } from '../schema/bookmarks.schema';
import { BookmarkService, UserService, RecipeService } from '../services';


async function userBookmarksHandler(
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) {
  const { user_id } = req.params;

  const limit = 20;
  const page = parseInt(req.query.page as string) || 1;
  const skip = (page - 1) * limit;
  const total = await BookmarkService.countUserBookmarks(user_id);

  const user = await UserService.findUserById(user_id);
  if (!user) {
    return res.status(404).send('User not found.');
  }

  const user_bookmarks = await BookmarkService.getUserBookmarks(String(user._id), limit, skip);
  
  const bookmarks = await Promise.all(user_bookmarks.map(async (bookmark) => {
    const recipe = await RecipeService.findRecipeById(String(bookmark.recipe));
    if (!recipe) return;
    return recipe;
  }));

  return res.status(200).send({
    bookmarks: bookmarks,
    pagination: {
      page: page,
      total_pages: Math.ceil(total / limit),
    }
  });
}


async function addBookmarkHandler(
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) {
  const { user_id, recipe_id } = req.params;

  const user_promise = UserService.findUserById(user_id);
  const recipe_promise = RecipeService.findRecipeById(recipe_id);

  const [user, recipe] = await Promise.all([user_promise, recipe_promise]);
  if (!user) return res.status(404).send('User not found.');
  if (!recipe) return res.status(404).send('Recipe not found.');

  const isBookmarked = await BookmarkService.isBookmarked({ 
    user_id: user_id, 
    recipe_id: recipe_id, 
  });

  if (isBookmarked) return res.status(400).send('Recipe is already bookmarked by user.');

  const bookmark = await BookmarkService.createBookmark({ 
    user: user._id, 
    recipe: recipe._id, 
  });

  return res.status(200).json({
    message: 'Bookmark added.',
    bookmark: bookmark,
  });
}


async function removeBookmarkHandler(
  req: Request<BookmarksInput, {}, {}>, 
  res: Response
) {
  const { user_id, recipe_id } = req.params;

  const user_promise = UserService.findUserById(user_id);
  const recipe_promise = RecipeService.findRecipeById(recipe_id);

  const [user, recipe] = await Promise.all([user_promise, recipe_promise]);
  if (!user) return res.status(404).send('User not found.');
  if (!recipe) return res.status(404).send('Recipe not found.');

  const isBookmarked = await BookmarkService.isBookmarked({ 
    user_id: user_id, 
    recipe_id: recipe_id, 
  });

  if (!isBookmarked) return res.status(400).send('Recipe is not bookmarked by user.');

  const removed = await BookmarkService.removeBookmark({ 
    user_id: user_id, 
    recipe_id: recipe_id, 
  });

  if(!removed) return res.status(400).send('Failed to remove bookmark.');

  return res.status(200).send('Bookmark removed.');
}


export default {
  userBookmarksHandler, 
  addBookmarkHandler, 
  removeBookmarkHandler, 
}
