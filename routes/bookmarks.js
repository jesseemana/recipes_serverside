const router = require('express').Router()
const bookmarksController = require('../controllers/bookmarks')
const verifyJWT = require('../middleware/auth')

router.route('/:id')
  .get(verifyJWT, bookmarksController.userBookmarks)

router.route('/:user_id/:recipe_id')
  .post(verifyJWT, bookmarksController.addBookmark)
  .delete(verifyJWT, bookmarksController.removeBookmark)

module.exports = router   