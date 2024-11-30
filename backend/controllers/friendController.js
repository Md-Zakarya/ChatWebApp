// backend/controllers/friendController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
// const { io, onlineUsers } = require('../config/socket');
const { io, onlineUsers } = require('../config/socket');
const { getIO } = require('../config/socket');




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
            request =>
                request.from.toString() === req.user._id.toString() &&
                request.status === 'pending'
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
    try {
        const { userId } = req.params;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid status'
            });
        }

        const receiver = await User.findById(req.user._id);
        const sender = await User.findById(userId);

        if (!sender || !receiver) {
            return res.status(404).json({
                status: 'error',
                message: 'User not found'
            });
        }

        // Find and update request
        const request = receiver.friendRequests.find(
            req => req.from.toString() === userId && req.status === 'pending'
        );

        if (!request) {
            return res.status(404).json({
                status: 'error',
                message: 'Friend request not found'
            });
        }

        request.status = status;

        if (status === 'accepted') {
            // Add to both users' friends lists if not already friends
            const receiverHasFriend = receiver.friends.some(f => f.user.toString() === userId);
            const senderHasFriend = sender.friends.some(f => f.user.toString() === receiver._id.toString());

            if (!receiverHasFriend) {
                receiver.friends.push({
                    user: userId,
                    status: 'accepted',
                    addedAt: new Date()
                });
            }

            if (!senderHasFriend) {
                sender.friends.push({
                    user: receiver._id,
                    status: 'accepted',
                    addedAt: new Date()
                });
            }

            // Save both documents in a transaction-like way
            await Promise.all([
                sender.save(),
                receiver.save()
            ]);

            // Emit socket event
            try {
                const io = getIO();
                const senderSocket = onlineUsers.get(userId);
                if (io && senderSocket) {
                    io.to(senderSocket).emit('friend_request_accepted', {
                        from: receiver._id,
                        username: receiver.username
                    });
                }
            } catch (socketError) {
                console.error('Socket error:', socketError);
                // Continue execution even if socket fails
            }
        } else {
            // If rejected, just save the receiver's updated request status
            await receiver.save();
        }

        return res.json({
            status: 'success',
            message: `Friend request ${status}`
        });

    } catch (error) {
        console.error('Friend request response error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Server error while processing friend request response'
        });
    }
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





// @desc    Remove a friend
// @route   DELETE /api/friends/:userId
// @access  Private
const removeFriend = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
        res.status(400);
        throw new Error('User ID is required');
    }

    // Find both users
    const user = await User.findById(req.user._id);
    const friend = await User.findById(userId);

    if (!friend) {
        res.status(404);
        throw new Error('User not found');
    }

    // Remove from user's friends array
    user.friends = user.friends.filter(f => f.user.toString() !== userId);
    // Remove any friend requests between users
    user.friendRequests = user.friendRequests.filter(
        r => r.from.toString() !== userId && r.from.toString() !== req.user._id.toString()
    );
    await user.save();

    // Remove from friend's friends array
    friend.friends = friend.friends.filter(f => f.user.toString() !== req.user._id.toString());
    // Remove any friend requests between users
    friend.friendRequests = friend.friendRequests.filter(
        r => r.from.toString() !== userId && r.from.toString() !== req.user._id.toString()
    );
    await friend.save();

    // **Delete all messages between the two users**
    await Message.deleteMany({
        $or: [
            { sender: req.user._id, receiver: userId },
            { sender: userId, receiver: req.user._id }
        ]
    });



    // Emit socket event...
    try {
        const io = getIO();
        const removedFriendSocket = onlineUsers.get(userId);
        
        console.log('Removing friend - Debug info:', {
            removedUserId: userId,
            socketFound: !!removedFriendSocket,
            onlineUsers: Array.from(onlineUsers.entries())
        });
        
        if (io && removedFriendSocket) {
            io.to(removedFriendSocket).emit('friend_removed', {
                username: user.username,
                userId: user._id.toString(),
            });
            console.log('Emitted friend_removed event to:', removedFriendSocket);
        } else {
            console.log('Could not emit friend_removed - socket not found');
        }
    } catch (socketError) {
        console.error('Socket error:', socketError);
    }

    res.json({ message: 'Friend removed successfully' });
});
module.exports = {
    sendFriendRequest,
    respondToFriendRequest,
    getFriends,
    getPendingRequests,
    removeFriend
};

