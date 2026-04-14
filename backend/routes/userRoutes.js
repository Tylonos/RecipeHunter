const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// These are the endpoints the frontend will call
router.post('/register', register);
router.post('/login', login);
router.put('/update/:id', require('../controllers/authController').updateProfile);

module.exports = router;