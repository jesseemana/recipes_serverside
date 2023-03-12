const express = require('express')
const router = express.Router()
const userController = require('../controllers/user')


router.route('/')
    .get(userController.getUSers)
    .post(userController.createUSer)
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router
