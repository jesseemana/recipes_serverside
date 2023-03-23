const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const loginLimiter = require('../middleware/loginLimiter')
const authorize = require('../middleware/auth')

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/register')
    .post(authController.createUSer)

router.route('/refresh')
    .get(authorize, authController.refresh)

router.route('/logout')
    .post(authorize, authController.logout)

module.exports = router