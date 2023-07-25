const router = require('express').Router()
const userController = require('../controllers/user')
const verifyUser = require('../middleware/auth')

router.use(verifyUser)

router.route('/')
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

router.route('/:id')
  .get(userController.getUser)

module.exports = router     