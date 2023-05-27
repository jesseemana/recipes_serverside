const router = require('express').Router()
const bookmarksController = require('../controllers/bookmarks')
const verifyJWT = require('../middleware/auth')


router.route('/:userId')
    .get(verifyJWT, bookmarksController.userBookmarks)


router.route('/:recipeId/:userId')
    .post(verifyJWT, bookmarksController.addBookmark)
    .delete(verifyJWT, bookmarksController.removeBookmark)


module.exports = router     