// backend/models/userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: '', // Empty string instead of default image path
        maxLength: 5242880 // Max 5MB
    },
    status: {
        text: {
            type: String,
            default: 'Hey there! I am using ChatApp'
        },
        isOnline: {
            type: Boolean,
            default: false
        }
    },
    lastSeen: Date,
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    },
    friends: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        chatHistory: Boolean, // true if there's chat history
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    friendRequests: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        sentAt: {
            type: Date,
            default: Date.now
        }
    }],
    blockedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: {
        sound: {
            type: Boolean,
            default: true
        },
        push: {
            type: Boolean,
            default: true
        }
    },
    unreadMessages: [{
        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        count: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);