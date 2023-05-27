const router = require('express').Router()
const userController = require('../controllers/user')
const verifyUser = require('../middleware/auth')

router.use(verifyUser)

// PROTECTED ROUTES 
router.route('/')
    .get(userController.getUsers)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/:id')
    .get(userController.getUser)

module.exports = router     