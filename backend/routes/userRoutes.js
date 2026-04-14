
const express = require('express');
const router = express.Router();

//Pull in the actual logic from our controller file
const { register, login } = require('../controllers/authController');

// When the frontend makes a POST request to these URLs, run the matching function
router.post('/register', register);
router.post('/login', login);

// We grab the updateProfile function straight from the require here. 
// The ':id' is a dynamic piece of the URL so we know *who* to update
router.put('/update/:id', require('../controllers/authController').updateProfile);

module.exports = router;