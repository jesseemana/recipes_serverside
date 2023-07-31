const router = require('express').Router();
const verifyUser = require('../middleware/auth');
const authController = require('../controllers/auth').default;
const loginLimiter = require('../middleware/loginLimiter');

router.route('/login')
  .post(loginLimiter, authController.login);

router.route('/register')
  .post(authController.createUser);

router.route('/reset')
  .post(authController.resetPwd);

router.route('/refresh')
  .get(verifyUser, authController.refresh);

router.route('/logout')
  .post(verifyUser, authController.logout);

module.exports = router;