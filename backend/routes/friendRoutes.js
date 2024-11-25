// backend/routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    sendFriendRequest,
    respondToFriendRequest,
    getFriends,
    getPendingRequests
} = require('../controllers/friendController');

router.post('/request/:userId', protect, sendFriendRequest);
router.put('/request/:userId', protect, respondToFriendRequest);
router.get('/', protect, getFriends);
router.get('/requests', protect, getPendingRequests);

module.exports = router;