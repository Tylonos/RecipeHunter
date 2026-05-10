
const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);

router.put('/update/:id', require('../controllers/authController').updateProfile);

// return current user (requires Authorization header)
router.get('/me', verifyToken, require('../controllers/authController').getProfile);

module.exports = router;