import { BookmarkModel } from '../models';
import { Bookmark } from '../models/bookmark.model';

type BookmarkType = {
  user_id: string, 
  recipe_id: string,
}

const countUserBookmarks = async (user_id: string) => {
  const count = await BookmarkModel.estimatedDocumentCount({ user: user_id });
  return count;
}

const isBookmarked = async ({ user_id, recipe_id }: BookmarkType) => {
  const bookmarked = await BookmarkModel.findOne({ 
    user: user_id, 
    recipe: recipe_id, 
  });
  if (bookmarked) return true;
  return false;
}

const getUserBookmarks = async (user_id: string, limit: number, index: number) => {
  const bookmarks = await BookmarkModel.find({ user: user_id })
    .sort({ createdAt: 'desc' })
    .skip(index)
    .limit(limit)
    .exec();

  return bookmarks;
}

const createBookmark = async (data: Bookmark) => {
  const bookmark = await BookmarkModel.create(data);
  return bookmark;
}

const removeBookmark = async ({ user_id, recipe_id }: BookmarkType) => {
  const removed = await BookmarkModel.findOneAndDelete({ 
    user: user_id, 
    recipe: recipe_id, 
  });
  if (!removed) return false;
  return true;
}

export default { 
  getUserBookmarks, 
  createBookmark, 
  isBookmarked,
  countUserBookmarks, 
  removeBookmark, 
}
