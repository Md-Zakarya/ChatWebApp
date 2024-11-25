// backend/controllers/userController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
const searchUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};

    const users = await User.find({
        ...keyword,
        _id: { $ne: req.user._id },
        blockedUsers: { $nin: [req.user._id] }
    }).select('username email avatar status.isOnline lastSeen');

    res.json(users);
});

// @desc    Add/Remove contact
// @route   POST /api/users/contacts/:id
// @access  Private
const toggleContact = asyncHandler(async (req, res) => {
    const contactId = req.params.id;
    const user = await User.findById(req.user._id);
    const contact = await User.findById(contactId);

    if (!contact) {
        res.status(404);
        throw new Error('Contact not found');
    }

    const existingContact = user.contacts.find(c => 
        c.user.toString() === contactId
    );

    if (existingContact) {
        user.contacts = user.contacts.filter(c => 
            c.user.toString() !== contactId
        );
    } else {
        user.contacts.push({
            user: contactId,
            nickname: req.body.nickname
        });
    }

    await user.save();
    res.json(user.contacts);
});

// @desc    Block/Unblock user
// @route   POST /api/users/block/:id
// @access  Private
const toggleBlockUser = asyncHandler(async (req, res) => {
    const userToBlock = req.params.id;
    const user = await User.findById(req.user._id);

    if (user.blockedUsers.includes(userToBlock)) {
        user.blockedUsers = user.blockedUsers.filter(id => 
            id.toString() !== userToBlock
        );
    } else {
        user.blockedUsers.push(userToBlock);
    }

    await user.save();
    res.json(user.blockedUsers);
});

// @desc    Update user settings
// @route   PUT /api/users/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.notifications = {
            ...user.notifications,
            ...req.body
        };

        const updatedUser = await user.save();
        res.json(updatedUser.notifications);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    searchUsers,
    toggleContact,
    toggleBlockUser,
    updateSettings
};