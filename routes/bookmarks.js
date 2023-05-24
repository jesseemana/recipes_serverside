const express = require('express')
const router = express.Router()
const verifyJWT = require('../middleware/auth')
const bookmarksController = require('../controllers/bookmarks')


router.route('/:userId')
    .get(verifyJWT, bookmarksController.userBookmarks)

router.route('/:recipeId/:userId')
    .post(verifyJWT, bookmarksController.bookmarkRecipe)
    .delete(verifyJWT, bookmarksController.removeBookmark);


module.exports = router