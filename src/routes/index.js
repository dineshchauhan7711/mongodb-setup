const router = require('express').Router();



// Routes
router.use('/user', require('./user.routes'));







module.exports = router;