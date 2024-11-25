// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getChatHistory,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage
} = require('../controllers/messageController');

router.get('/:userId', protect, getChatHistory);
router.post('/', protect, sendMessage);
router.put('/:id', protect, editMessage);
router.delete('/:id', protect, deleteMessage);
router.post('/:id/react', protect, reactToMessage);


module.exports = router;