const router = require('express').Router()
const multer = require("multer")
const verifyJWT = require('../middleware/auth')
const recipeController = require('../controllers/recipe')

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

router.route('/')
  .get(recipeController.getRecipes)
  .post(verifyJWT, upload.single('picture'), recipeController.createRecipe)
  .patch(verifyJWT, recipeController.updateRecipe)
  .delete(verifyJWT, recipeController.deleteRecipe)

router.route('/like/:id')
  .post(verifyJWT, recipeController.likeRecipe)

router.route('/:id/:userId')
  .get(recipeController.getSingleRecipe)

router.route('/user/:user')
  .get(recipeController.getUserRecipes)

module.exports = router         