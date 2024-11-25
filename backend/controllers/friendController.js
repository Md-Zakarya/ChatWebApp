// backend/controllers/friendController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

// @desc    Send friend request
// @route   POST /api/friends/request/:userId
// @access  Private
const sendFriendRequest = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Validate userId
        if (!userId) {
            return res.status(400).json({
                status: 'error',
                message: 'User ID is required'
            });
        }

        const sender = await User.findById(req.user._id);
        const receiver = await User.findById(userId);

        if (!receiver) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Check if request already exists
        const existingRequest = receiver.friendRequests.find(
            request => request.from.toString() === req.user._id.toString()
        );

        if (existingRequest) {
            return res.status(400).json({
                status: 'error',
                message: 'Friend request already sent to this user'
            });
        }

        // Check if they're already friends
        const existingFriend = sender.friends.find(
            friend => friend.user.toString() === userId
        );

        if (existingFriend) {
            return res.status(400).json({
                status: 'error',
                message: 'You are already friends with this user'
            });
        }

        // Add friend request
        receiver.friendRequests.push({
            from: req.user._id,
            status: 'pending'
        });

        await receiver.save();

        return res.status(201).json({
            status: 'success',
            message: 'Friend request sent successfully'
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Server error while processing friend request'
        });
    }
});
// @desc    Respond to friend request
// @route   PUT /api/friends/request/:userId
// @access  Private
const respondToFriendRequest = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    const receiver = await User.findById(req.user._id);
    const sender = await User.findById(userId);

    if (!sender) {
        res.status(404);
        throw new Error('User not found');
    }

    // Find and update request
    const request = receiver.friendRequests.find(
        req => req.from.toString() === userId && req.status === 'pending'
    );

    if (!request) {
        res.status(404);
        throw new Error('Friend request not found');
    }

    request.status = status;

    if (status === 'accepted') {
        // Add to both users' friends lists
        receiver.friends.push({
            user: userId,
            status: 'accepted'
        });

        sender.friends.push({
            user: req.user._id,
            status: 'accepted'
        });

        await sender.save();
    }

    await receiver.save();

    res.json({ message: `Friend request ${status}` });
});

// @desc    Get all friends
// @route   GET /api/friends
// @access  Private
const getFriends = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: 'friends.user',
            select: 'username email avatar status.isOnline lastSeen'
        });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    const friends = await Promise.all(user.friends
        .filter(friend => friend.status === 'accepted' && friend.user) // Ensure friend.user exists
        .map(async (friend) => {
            try {
                const hasChat = await Message.exists({
                    $or: [
                        { sender: req.user._id, receiver: friend.user._id },
                        { sender: friend.user._id, receiver: req.user._id }
                    ]
                });

                return {
                    ...(friend.user.toObject()), // Use toObject() instead of _doc
                    chatHistory: !!hasChat,
                    addedAt: friend.addedAt
                };
            } catch (error) {
                console.error('Error processing friend:', error);
                return null;
            }
        }));

    res.json(friends.filter(Boolean)); // Filter out any null results
});

// @desc    Get pending friend requests
// @route   GET /api/friends/requests
// @access  Private
const getPendingRequests = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: 'friendRequests.from',
            select: 'username email avatar status.isOnline'
        });

    const pendingRequests = user.friendRequests
        .filter(request => request.status === 'pending');

    res.json(pendingRequests);
});

module.exports = {
    sendFriendRequest,
    respondToFriendRequest,
    getFriends,
    getPendingRequests
};