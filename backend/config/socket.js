// backend/config/socket.js
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

const setupSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "http://localhost:5174",
            methods: ["GET", "POST"]
        }
    });

    // Store online users
    const onlineUsers = new Map();
    // Store typing status
    const typingUsers = new Map();

    // Socket middleware for authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', async (socket) => {
        // console.log('User connected:', socket.user.username);
        
        // Update user's online status
        await User.findByIdAndUpdate(socket.user._id, {
            'status.isOnline': true,
            lastSeen: new Date()
        });
        
        // Add to online users
        onlineUsers.set(socket.user._id.toString(), socket.id);
        
        // Broadcast online status
        io.emit('user_status_change', {
            userId: socket.user._id,
            isOnline: true
        });

        // Handle private messages
        socket.on('private_message', async ({ to, message }) => {
            const receiverSocket = onlineUsers.get(to);
            
            // Save message to database
            const newMessage = await Message.create({
                sender: socket.user._id,
                receiver: to,
                content: message.content,
                type: message.type || 'text',
                replyTo: message.replyTo 
            });

            const populatedMessage = await newMessage.populate([
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

            // Send to receiver if online
            if (receiverSocket) {
                io.to(receiverSocket).emit('receive_message', populatedMessage);
                // Update message status to delivered
                await Message.findByIdAndUpdate(newMessage._id, { status: 'delivered' });
            }

            // Send back to sender with message id
            socket.emit('message_sent', populatedMessage);
        });

        // Handle typing status
        socket.on('typing_start', (receiverId) => {
            const receiverSocket = onlineUsers.get(receiverId);
            if (receiverSocket) {
                io.to(receiverSocket).emit('typing_status', {
                    userId: socket.user._id,
                    isTyping: true
                });
            }
            
            // Clear previous typing timeout
            if (typingUsers.has(socket.user._id)) {
                clearTimeout(typingUsers.get(socket.user._id));
            }
            
            // Set new typing timeout
            const timeout = setTimeout(() => {
                const receiverSocket = onlineUsers.get(receiverId);
                if (receiverSocket) {
                    io.to(receiverSocket).emit('typing_status', {
                        userId: socket.user._id,
                        isTyping: false
                    });
                }
                typingUsers.delete(socket.user._id);
            }, 3000);
            
            typingUsers.set(socket.user._id, timeout);
        });

        // Handle message read status
        socket.on('message_read', async ({ messageId, senderId }) => {
            await Message.findByIdAndUpdate(messageId, { status: 'read' });
            
            const senderSocket = onlineUsers.get(senderId);
            if (senderSocket) {
                io.to(senderSocket).emit('message_status_update', {
                    messageId,
                    status: 'read'
                });
            }
        });

// Listen for 'user_active' event
socket.on('user_active', async () => {
    // Update user's online status
    await User.findByIdAndUpdate(socket.user._id, {
        'status.isOnline': true,
        lastSeen: new Date()
    });

    // Add to online users
    onlineUsers.set(socket.user._id.toString(), socket.id);
    
    // Broadcast online status
    io.emit('user_status_change', {
        userId: socket.user._id,
        isOnline: true,
        lastSeen: new Date()
    });
});

// Listen for 'user_inactive' event
socket.on('user_inactive', async () => {
    // Update user's offline status
    await User.findByIdAndUpdate(socket.user._id, {
        'status.isOnline': false,
        lastSeen: new Date()
    });
    
    // Broadcast offline status
    io.emit('user_status_change', {
        userId: socket.user._id,
        isOnline: false,
        lastSeen: new Date()
    });
});
        
        



        // Handle disconnection
        socket.on('disconnect', async () => {


            console.log('User disconnected:', socket.user.username);
            // Clear typing timeout
            if (typingUsers.has(socket.user._id)) {
                clearTimeout(typingUsers.get(socket.user._id));
                typingUsers.delete(socket.user._id);
            }

            // Update user's offline status
            await User.findByIdAndUpdate(socket.user._id, {
                'status.isOnline': false,
                lastSeen: new Date()
            });

            // Remove from online users
            onlineUsers.delete(socket.user._id.toString());
            
            // Broadcast offline status
            io.emit('user_status_change', {
                userId: socket.user._id,
                isOnline: false,
                lastSeen: new Date()
            });
        });

        
    // Friend request events
    socket.on('friend_request', async ({ to, from }) => {
        const receiverSocket = onlineUsers.get(to);
        if (receiverSocket) {
            io.to(receiverSocket).emit('friend_request_received', {
                from: socket.user._id,
                username: socket.user.username
            });
        }
    });

    socket.on('friend_request_response', async ({ to, accepted }) => {
        const receiverSocket = onlineUsers.get(to);
        if (receiverSocket) {
            io.to(receiverSocket).emit('friend_request_updated', {
                from: socket.user._id,
                accepted
            });
        }
    });


    socket.on('message_reaction', async ({ messageId, emoji }) => {
        const message = await Message.findById(messageId)
            .populate('reactions.user', 'username');
        
        const existingReaction = message.reactions.find(
            r => r.user._id.toString() === socket.user._id.toString()
        );
    
        if (existingReaction) {
            existingReaction.emoji = emoji;
        } else {
            message.reactions.push({ user: socket.user._id, emoji });
        }
        
        await message.save();
    
        // Send to both sender and receiver
        const receiverSocket = onlineUsers.get(message.receiver.toString());
        const senderSocket = onlineUsers.get(message.sender.toString());
        
        const reactionUpdate = {
            messageId,
            reactions: message.reactions
        };
    
        // Send to receiver
        if (receiverSocket) {
            io.to(receiverSocket).emit('message_reaction_update', reactionUpdate);
        }
        
        // Send to sender 
        if (senderSocket) {
            io.to(senderSocket).emit('message_reaction_update', reactionUpdate);
        }
    });
    // Handle message editing
    socket.on('edit_message', async ({ messageId, newContent, receiverId }) => {
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('message_edited', {
                messageId,
                newContent
            });
        }
    });

    socket.on('delete_message', async ({ messageId, receiverId }) => {
        const receiverSocket = onlineUsers.get(receiverId);
        if (receiverSocket) {
            io.to(receiverSocket).emit('message_deleted', {
                messageId
            });
        }
    });
    
    
    

    });

    return io;
};

module.exports = setupSocket;