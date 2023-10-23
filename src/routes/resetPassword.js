const router = require('express').Router()
const passwordController = require('../controllers/resetPassword')

router.route('/').post(passwordController.sendLink)

router.route('/:id/:token').patch(passwordController.resetPassword)

module.exports = router 