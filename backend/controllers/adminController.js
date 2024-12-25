// controllers/adminController.js
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const loginAdmin = asyncHandler(async (req, res) => {
    console.log('Login attempt:', { email: req.body.email }); // Log login attempt
    
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        console.log('Missing credentials');
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No'); // Log if user exists
    
    if (!user || user.role !== 'admin') {
        console.log('Not admin or user not found');
        return res.status(401).json({ message: 'Not authorized as admin' });
    }

    console.log('Comparing passwords...'); // Log before password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log password match result

    if (!isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
    }


 const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Increased token expiration to 7 days
);

    console.log('Login successful'); // Log successful login
    res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token,
        isPersistent: true 
    });
});


const getAdminStats = asyncHandler(async (req, res) => {
    // Time windows
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    // Basic stats
    const totalUsers = await User.countDocuments();
    
    // Active chats in last 24h (count distinct conversations)
    const activeChats = await Message.distinct('conversationId', {
        createdAt: { $gte: last24Hours }
    }).then(conversations => conversations.length);

    // Messages stats
    const currentPeriodMessages = await Message.countDocuments({
        createdAt: { $gte: last7Days }
    });
    
    const previousPeriodMessages = await Message.countDocuments({
        createdAt: { 
            $gte: previous7Days,
            $lt: last7Days
        }
    });

    // Calculate daily average and trend
    const messagesPerDay = Math.round(currentPeriodMessages / 7);
    const messagesTrend = previousPeriodMessages > 0 
        ? ((currentPeriodMessages - previousPeriodMessages) / previousPeriodMessages * 100).toFixed(1)
        : 0;

    res.json({
        totalUsers,
        activeChats,
        messagesPerDay,
        messagesTrend: parseFloat(messagesTrend)
    });
});






const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user._id.equals(req.user._id)) {
            res.status(400);
            throw new Error('Cannot update own role');
        }
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = {
    getAllUsers,
    deleteUser,
    updateUserRole,
    getAdminStats,
    loginAdmin
};