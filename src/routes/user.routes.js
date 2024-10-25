const router = require('express').Router();

// Controllers
const {
     userController
} = require('../controllers');

// Middlewares
const {
     auth: {
          userAuth,
          userPermission
     }
} = require('../middlewares');


router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/profile', userAuth, userPermission(['admin', 'user']), userController.getProfile);
router.patch('/update-profile', userAuth, userPermission(['admin', 'user']), userController.updateProfile);
router.delete('/logout', userAuth, userController.logout);
router.post('/send-forgot-password-email', userController.sendForgotPasswordEmail);
router.post('/verify-forgot-password-link', userController.verifyForgotPasswordLink);
router.patch('/forgot-password', userController.forgotPassword);


module.exports = router;