const User = require('../models/User');
const Recipe = require('../models/Recipe');

const userBookmarks = async (req, res) => {
  const {userId} = req.params;
  if (!userId) return res.status(400).json({message: 'Provide a user id'});
  const user = await User.findById(userId);
  if (!user) return res.status(401).json({message: 'user not found'});
  const user_bookmarks = [...(user.bookmarks || [])];

  const bookmarks = [];
  for (const bookmark of user_bookmarks) {
    const recipe = await Recipe.findById(bookmark);
    if (recipe) { bookmarks.push(recipe) }
  }

  res.status(200).json(bookmarks);
};

const addBookmark = async (req, res) => {
  const {recipeId, userId} = req.params;
  if (!recipeId || !userId) return res.status(400).json({message: 'Provide recipe and user id'});

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({message: 'User not found'});

  const user_bookmarks = [...(user.bookmarks || [])];
  if (user_bookmarks.includes(recipeId)) 
    return res.status(400).json({message: 'Recipe already bookmarked'})

  user_bookmarks.push(recipeId);

  await user.save();

  res.status(200).json({ 
    user, 
    message: 'Recipe added to bookmarks', 
  });
};

const removeBookmark = async (req, res) => {
  const {recipeId, userId} = req.params;
  if (!recipeId || !userId) res.status(400).json({message: 'Provide recipe and user id'});

  const user = await User.findById(userId);
  const user_bookmarks = [...(user.bookmarks) || []];
  if (!user_bookmarks.includes(recipeId))
    return res.status(400).json({message: 'Recipe not bookmarked'});

  user_bookmarks = user_bookmarks.filter((bookmark) => bookmark.toString() !== recipeId);

  await user.save();

  res.status(200).json({ 
    user, 
    message: 'Recipe removed from bookmarks', 
  });
};

module.exports = {
  userBookmarks,
  addBookmark,
  removeBookmark,
}       