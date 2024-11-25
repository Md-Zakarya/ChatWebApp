// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    searchUsers,
    toggleContact,
    toggleBlockUser,
    updateSettings
} = require('../controllers/userController');

router.get('/search', protect, searchUsers);
router.post('/contacts/:id', protect, toggleContact);
router.post('/block/:id', protect, toggleBlockUser);
router.put('/settings', protect, updateSettings);

module.exports = router;