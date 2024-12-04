const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile  } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

//User Login and signup routes
router.post('/register', registerUser);
router.post('/login', loginUser);


//after successful login
// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;