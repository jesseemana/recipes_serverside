const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const verifyJWT = require('../middleware/auth')

router.use(verifyJWT)

// PROTECTED ROUTES 
router.route('/')
    .get(userController.getUSers)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router