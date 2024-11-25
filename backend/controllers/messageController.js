// backend/controllers/messageController.js
const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const validateReplyMessage = async (replyToId, userId, receiver) => {
    if (!replyToId) return true;
    
    const replyMessage = await Message.findById(replyToId)
        .select('sender receiver content isDeleted');
    
    if (!replyMessage || replyMessage.isDeleted) {
        return false;
    }
    
    // Validate that reply is from the same chat
    const validParticipants = [
        replyMessage.sender.toString(),
        replyMessage.receiver.toString()
    ];
    
    return validParticipants.includes(userId.toString()) && 
           validParticipants.includes(receiver.toString());
};
const getChatHistory = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
        $or: [
            { sender: req.user._id, receiver: req.params.userId },
            { sender: req.params.userId, receiver: req.user._id }
        ],
        isDeleted: { $ne: true }
    })
    .sort({ createdAt: -1 })
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

    console.log('Fetched messages:', messages);

    await Message.updateMany(
        {
            sender: req.params.userId,
            receiver: req.user._id,
            status: { $ne: 'read' }
        },
        { status: 'read' }
    );

  

    res.json(messages.reverse());
});

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

    const EDIT_WINDOW = 24 * 60 * 60 * 1000;
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
        existingReaction.emoji = emoji;
    } else {
        message.reactions.push({ user: req.user._id, emoji });
    }

    await message.save();
    res.json(message.reactions);
});

module.exports = {
    getChatHistory,
    sendMessage,
    editMessage,
    deleteMessage,
    reactToMessage
};