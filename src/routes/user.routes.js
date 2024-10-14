const router = require('express').Router();

// Controllers
const userController = require('../controllers/user.controller');

// Middlewares
const { userAuth } = require('../middlewares/auth');


router.post('/signup', userController.signup);
router.post('/login', userController.login);


module.exports = router;