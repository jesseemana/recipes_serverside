const router = require('express').Router();
const verifyUser = require('../middleware/auth');
const authController = require('../controllers/auth');
const loginLimiter = require('../middleware/loginLimiter');

router.post('/login', loginLimiter, authController.createSessionHandler)

router.post('/register', authController.createUserHandler)

router.get('/refresh', authController.refreshTokenHandler)

router.post('/logout', verifyUser, authController.destroySessionHandler)

module.exports = router 