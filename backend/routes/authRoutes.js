const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
// Get User Profile Route
router.get('/profile', protect, getUserProfile);

// Update User Profile Route
=======
const { registerUser, loginUser, getUserProfile, updateUserProfile  } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

//User Login and signup routes
router.post('/register', registerUser);
router.post('/login', loginUser);


//after successful login
// Protected routes
router.get('/profile', protect, getUserProfile);
>>>>>>> feature/darkmode-bugfix
router.put('/profile', protect, updateUserProfile);

module.exports = router;