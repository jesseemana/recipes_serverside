const User = require('../models/User');
const Recipe = require('../models/Recipe');


const userBookmarks = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: 'Provide a user id' });

  const user = await User.findById(id);
  if (!user) return res.status(401).json({ message: 'user not found' });

  const user_bookmarks = user.bookmarks;

  const bookmarks = [];
  for (const bookmark of user_bookmarks) {
    const recipe = await Recipe.findById(bookmark);
    if (recipe) { 
      bookmarks.push(recipe) 
    }
  }

  res.status(200).json(bookmarks);
};


const addBookmark = async (req, res) => {
  const { user_id, recipe_id } = req.params;
  if (!recipe_id || !user_id) 
    return res.status(400).json({ message: 'Provide recipe and user id' });

  const recipe = await Recipe.findById(recipe_id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  const user = await User.findById(user_id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const bookmarks = user.bookmarks;

  if (bookmarks.includes(recipe_id)) 
    return res.status(400).json({ message: 'Recipe already bookmarked' })

  bookmarks.push(recipe_id);

  await user.save();

  res.status(200).json({ message: 'Recipe added to bookmarks' });
};


const removeBookmark = async (req, res) => {
  const { user_id, recipe_id } = req.params;
  if (!recipe_id || !user_id) 
    return res.status(400).json({ message: 'Provide recipe and user id' });

  const recipe = await Recipe.findById(recipe_id);
  if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
  const user = await User.findById(user_id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  
  const bookmarks = user.bookmarks;
  console.log(bookmarks)
  
  if (!bookmarks.includes(recipe_id))
    return res.status(400).json({ message: 'Recipe not bookmarked' });

  user.bookmarks = [...(bookmarks.filter((bookmark) => bookmark.toString() !== recipe_id))];
  console.log(user.bookmarks)

  await user.save();

  res.status(200).json({ message: `Recipe for ${recipe.name} removed from bookmarks` });
};


module.exports = {
  userBookmarks,
  addBookmark,
  removeBookmark,
}   