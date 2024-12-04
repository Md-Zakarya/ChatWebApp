<<<<<<< HEAD
// backend/routes/messageRoutes.js
=======
>>>>>>> feature/darkmode-bugfix
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getChatHistory,
    sendMessage,
    editMessage,
    deleteMessage,
<<<<<<< HEAD
    reactToMessage
} = require('../controllers/messageController');

router.get('/:userId', protect, getChatHistory);
router.post('/', protect, sendMessage);
router.put('/:id', protect, editMessage);
router.delete('/:id', protect, deleteMessage);
router.post('/:id/react', protect, reactToMessage);


module.exports = router;
=======
    reactToMessage,
    getSuggestedReplies
} = require('../controllers/messageController');

// Fetch chat history with a specific user.
router.get('/:userId', protect, getChatHistory);

// Send a new message.
router.post('/', protect, sendMessage);

// Edit an existing message.
router.put('/:id', protect, editMessage);

// Delete a message.
router.delete('/:id', protect, deleteMessage);

// React to a message with an emoji.
router.post('/:id/react', protect, reactToMessage);

router.post('/suggest-reply', protect, getSuggestedReplies);


module.exports = router;
>>>>>>> feature/darkmode-bugfix
