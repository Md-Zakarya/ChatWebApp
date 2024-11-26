// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const multer = require('multer');


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        username,
        email,
        password
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Update online status
        user.status.isOnline = true;
        user.lastSeen = new Date();
        await user.save();

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            token: generateToken(user._id)
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('contacts.user', 'username email avatar status.isOnline lastSeen');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).single('avatar');


const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        
        // Handle base64 avatar
        if (req.body.avatar) {
            // Validate size (5MB limit)
            const base64Size = Buffer.from(req.body.avatar.split(',')[1], 'base64').length;
            if (base64Size > 5242880) { // 5MB in bytes
                res.status(400);
                throw new Error('Avatar image must be less than 5MB');
            }
            user.avatar = req.body.avatar;
        }

        user.status.text = req.body.status || user.status.text;
        user.theme = req.body.theme || user.theme;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            status: updatedUser.status,
            theme: updatedUser.theme,
            token: generateToken(updatedUser._id)
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile
};