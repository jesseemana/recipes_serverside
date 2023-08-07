const router = require('express').Router()
const passwordController = require('../controllers/resetPassword')

router.route('/')
  .post(passwordController.forgotPassword)

router.route('/:id/:token')
  .patch(passwordController.resetPassword)

module.exports = router 