const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')
const verifyJWT = require('../middleware/auth')


router.route('/')
    .get(verifyJWT, userController.getUSers)
    .post(userController.createUSer)
    .patch(verifyJWT, userController.updateUser)
    .delete(verifyJWT, userController.deleteUser)

module.exports = router