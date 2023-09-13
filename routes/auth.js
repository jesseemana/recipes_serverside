const router = require('express').Router();
const verifyUser = require('../middleware/auth');
const authController = require('../controllers/auth');
const loginLimiter = require('../middleware/loginLimiter');

router.route('/login')
  .post(loginLimiter, authController.login);

router.route('/register')
  .post(authController.createUser);

router.route('/refresh')
  .get(authController.refresh);

router.route('/logout')
  .post(verifyUser, authController.logout);

module.exports = router;