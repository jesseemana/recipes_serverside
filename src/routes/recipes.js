const router = require('express').Router()
const upload = require('../middleware/multer')
const verifyJWT = require('../middleware/auth')
const recipeController = require('../controllers/recipe')

router.route('/')
  .get(recipeController.getAllRecipes)
  .post(verifyJWT, upload.single('file'), recipeController.createRecipe)
  .patch(verifyJWT, recipeController.updateRecipe)

router.route('/:id')
  .get(recipeController.getSingleRecipe)
  .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/user/:user')
  .get(recipeController.getUserRecipes)

module.exports = router         