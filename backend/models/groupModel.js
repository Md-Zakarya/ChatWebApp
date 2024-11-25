const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    avatar: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        notifications: {
            muted: {
                type: Boolean,
                default: false
            },
            lastRead: {
                type: Date,
                default: Date.now
            }
        }
    }],
    settings: {
        onlyAdminsCanPost: {
            type: Boolean,
            default: false
        },
        onlyAdminsCanAddMembers: {
            type: Boolean,
            default: false
        },
        onlyAdminsCanEditInfo: {
            type: Boolean,
            default: true
        }
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

groupSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Group', groupSchema);