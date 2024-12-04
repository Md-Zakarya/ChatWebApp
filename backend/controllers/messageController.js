const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const testGeminiConnection = async () => {
    try {
        console.log('Testing Gemini Connection...');
        console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Say 'API Connection Successful'");
        const response = await result.response;
        
        console.log('Gemini Response:', response.text());
        console.log('Connection test passed!');
        return true;
    } catch (error) {
        console.error('Gemini Connection Error:', {
            message: error.message,
            stack: error.stack
        });
        return false;
    }
};

const getSuggestedReplies = asyncHandler(async (req, res) => {
    const { messageContent, chatHistory } = req.body;

    try {
        // Get the generative model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate content
        const result = await model.generateContent(
            `Generate 3 short reply suggestions for this message: "${messageContent}". 
             Recent chat context: ${chatHistory.slice(-5).map(m => m.content).join(' | ')}`
        );

        const response = await result.response;
        const suggestions = response.text()
            .split('\n')
            .filter(s => s.trim())
            .slice(0, 3);

        res.json({ suggestions });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ message: 'Failed to generate suggestions' });
    }
});

/**
 * Validates if a reply message is valid:
 * - Checks if the replied message exists and is not deleted.
 * - Ensures that the reply is part of the same chat between the two users.
 */
const validateReplyMessage = async (replyToId, userId, receiver) => {
    if (!replyToId) return true; // If no replyTo ID is provided, validation passes.

    const replyMessage = await Message.findById(replyToId)
        .select('sender receiver content isDeleted');
    
    if (!replyMessage || replyMessage.isDeleted) {
        return false; // Replied message doesn't exist or is deleted.
    }

    // Ensure the reply belongs to the same chat participants.
    const validParticipants = [
        replyMessage.sender.toString(),
        replyMessage.receiver.toString()
    ];
    return validParticipants.includes(userId.toString()) && 
           validParticipants.includes(receiver.toString());
};

/**
 * Fetches chat history between two users with pagination.
 * - Messages are retrieved based on sender and receiver criteria.
 * - Supports pagination using query params `page` and `limit`.
 * - Populates sender, receiver, and replyTo fields for richer data.
 */
const getChatHistory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user._id }
        ],
        isDeleted: { $ne: true } // Exclude deleted messages.
    })
    .sort({ createdAt: -1 }) // Sort messages by newest first.
    .skip(skip)
    .limit(limit)
    .populate('sender receiver', 'username avatar')
    .populate({
        path: 'replyTo',
        select: 'content sender receiver isDeleted createdAt',
        populate: {
            path: 'sender',
            select: 'username avatar'
        }
    });

    // Mark unread messages from the other user as "read".
    await Message.updateMany(
        {
            sender: req.params.userId,
            receiver: req.user._id,
            status: { $ne: 'read' }
        },
        { status: 'read' }
    );

    // Reverse messages to show oldest first in the response.
    res.json(messages.reverse());
});

/**
 * Sends a new message:
 * - Validates if a reply message is valid (if provided).
 * - Creates a new message in the database.
 * - Populates relevant fields for the response.
 */
const sendMessage = asyncHandler(async (req, res) => {
    const { receiver, content, type, replyTo } = req.body;

    const isValidReply = await validateReplyMessage(replyTo, req.user._id, receiver);
    if (replyTo && !isValidReply) {
        res.status(400);
        throw new Error('Invalid reply message');
    }

    const message = await Message.create({
        sender: req.user._id,
        receiver,
        content,
        type: type || 'text',
        replyTo,
        status: 'sent'
    });

    const populatedMessage = await message.populate([
        { path: 'sender receiver', select: 'username avatar' },
        {
            path: 'replyTo',
            select: 'content sender receiver isDeleted createdAt',
            populate: {
                path: 'sender',
                select: 'username avatar'
            }
        }
    ]);

    res.status(201).json(populatedMessage);
});

/**
 * Edits an existing message:
 * - Only the sender can edit their message.
 * - Editing is allowed only within a 24-hour window.
 */
const editMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    const EDIT_WINDOW = 24 * 60 * 60 * 1000; // 24-hour window.
    if (Date.now() - message.createdAt > EDIT_WINDOW) {
        res.status(403);
        throw new Error('Message can no longer be edited');
    }

    message.content = req.body.content;
    message.isEdited = true;
    await message.save();

    const populatedMessage = await message.populate([
        { path: 'sender receiver', select: 'username avatar' },
        {
            path: 'replyTo',
            select: 'content sender receiver isDeleted createdAt',
            populate: {
                path: 'sender',
                select: 'username avatar'
            }
        }
    ]);

    res.json(populatedMessage);
});

/**
 * Deletes a message:
 * - Marks the message as deleted and replaces its content with a placeholder.
 * - Only the sender can delete their message.
 */
const deleteMessage = asyncHandler(async (req, res) => {
    const message = await Message.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    if (message.sender.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized');
    }

    message.isDeleted = true;
    message.content = "This message was deleted";
    message.deletedAt = new Date();
    await message.save();

    const populatedMessage = await message.populate([
        { path: 'sender receiver', select: 'username avatar' },
        {
            path: 'replyTo',
            select: 'content sender receiver isDeleted createdAt',
            populate: {
                path: 'sender',
                select: 'username avatar'
            }
        }
    ]);

    res.json(populatedMessage);
});

/**
 * Reacts to a message:
 * - Adds or updates the emoji reaction for a message by the user.
 */
const reactToMessage = asyncHandler(async (req, res) => {
    const { emoji } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
        res.status(404);
        throw new Error('Message not found');
    }

    const existingReaction = message.reactions.find(
        r => r.user.toString() === req.user._id.toString()
    );

    if (existingReaction) {
        existingReaction.emoji = emoji; // Update existing reaction.
    } else {
        message.reactions.push({ user: req.user._id, emoji }); // Add new reaction.
    }

    await message.save();
    res.json(message.reactions);
});
// (async () => {
//     const isConnected = await testGeminiConnection();
//     console.log('Gemini Connection Status:', isConnected);
// })();


module.exports = {
    getChatHistory,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage,
    getSuggestedReplies
};
