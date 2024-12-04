// backend/routes/friendRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    sendFriendRequest,
    respondToFriendRequest,
    getFriends,
<<<<<<< HEAD
    getPendingRequests
} = require('../controllers/friendController');

router.post('/request/:userId', protect, sendFriendRequest);
router.put('/request/:userId', protect, respondToFriendRequest);
router.get('/', protect, getFriends);
=======
    getPendingRequests,
    removeFriend
} = require('../controllers/friendController');


router.post('/request/:userId', protect, sendFriendRequest);
router.put('/request/:userId', protect, respondToFriendRequest);
router.get('/', protect, getFriends);
router.delete('/:userId', protect, removeFriend);
>>>>>>> feature/darkmode-bugfix
router.get('/requests', protect, getPendingRequests);

module.exports = router;