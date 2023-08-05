const router = require('express').Router()
const passwordController = require('../controllers/resetPassword')

router.route('/forgotpassword')
  .post(passwordController.forgotPassword)

router.route('/resetpassword')
  .post(passwordController.resetPassword)

module.exports = router