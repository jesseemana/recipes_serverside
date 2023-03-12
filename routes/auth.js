const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.route('/')
    .post(authController.login)


router.route('/logout')
    .post(authController.logout)

module.exports = router