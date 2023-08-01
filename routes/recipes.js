const router = require('express').Router()
const upload = require('../middleware/multer')
const verifyJWT = require('../middleware/auth')
const recipeController = require('../controllers/recipe')

router.route('/')
  .get(recipeController.getRecipes)
  .post(verifyJWT, upload.single('file'), recipeController.createRecipe)
  .patch(verifyJWT, recipeController.updateRecipe)
  .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/like/:id')
  .post(verifyJWT, recipeController.likeRecipe)

router.route('/:id/:userId')
  .get(recipeController.getSingleRecipe)

router.route('/user/:user')
  .get(recipeController.getUserRecipes)

module.exports = router         