const router = require('express').Router()
const passwordController = require('../controllers/resetPassword')

router.route('/forgot-password')
  .post(passwordController.forgotPassword)

router.route('/reset-password/:id/:token')
  .patch(passwordController.resetPassword)

module.exports = router 