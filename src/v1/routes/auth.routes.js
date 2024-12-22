const loginService = require('../controllers/auth/login.controller');
const signup = require('../controllers/auth/signUp.controller');
const router = require('express').Router();

router.route('/signup').post(signup);
router.route('/login').post(loginService);

module.exports = router;
