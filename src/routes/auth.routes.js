const express = require('express');
const router = express.Router();

const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateUserSignup, validateUserLogin } = require('../middleware/validation');

// Public routes
router.post('/signup', validateUserSignup, signup);
router.post('/login', validateUserLogin, login);

// Private routes
router.get('/me', protect, getMe);

module.exports = router;