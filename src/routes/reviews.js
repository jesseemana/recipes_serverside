const router = require('express').Router()
const verifyJWT = require('../middleware/auth')
const reviewsController = require('../controllers/reviews')

router.route('/create') // pass in the id for the recipe we're commenting on
  .post(verifyJWT, reviewsController.createReview)

module.exports = router 