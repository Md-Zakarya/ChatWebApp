const express = require('express');
const router = express.Router();
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
router.put('/profile', protect, updateUserProfile);

module.exports = router;