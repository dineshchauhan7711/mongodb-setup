const router = require('express').Router();

// Controllers
const userController = require('../controllers/user.controller');

// Middlewares
const { userAuth } = require('../middlewares/auth');


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', userAuth, userController.getProfile);
router.delete('/logout', userAuth, userController.logout);
router.post('/send-forgot-password-email', userController.sendForgotPasswordEmail);
router.post('/verify-forgot-password-link', userController.verifyForgotPasswordLink);
router.patch('/forgot-password', userController.forgotPassword);


module.exports = router;