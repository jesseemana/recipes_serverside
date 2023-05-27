const router = require('express').Router()
const authController = require('../controllers/auth')
const loginLimiter = require('../middleware/loginLimiter')
const verifyUser = require('../middleware/auth')

router.route('/login')
    .post(loginLimiter, authController.login)

router.route('/register')
    .post(authController.createUSer)

router.route('/reset')
    .post(authController.resetPwd)

router.route('/refresh')
    .get(verifyUser, authController.refresh)

router.route('/logout')
    .post(verifyUser, authController.logout)

module.exports = router