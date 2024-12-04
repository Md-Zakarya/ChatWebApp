import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../services/axios';
import { toast } from 'react-toastify';
<<<<<<< HEAD
import { useFriend } from './FriendContext'
=======
import { useFriend } from './FriendContext';
>>>>>>> feature/darkmode-bugfix

const ChatContext = createContext();
const SELECTED_USER_KEY = 'selectedChatUser';

export const ChatProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [unreadCounts, setUnreadCounts] = useState({});
    const { user } = useAuth();
    const { fetchFriends, fetchPendingRequests } = useFriend();
<<<<<<< HEAD

         // New useEffect to handle window focus
         useEffect(() => {
            const handleFocus = () => {
                if (socket) {
                    socket.emit('user_active');
                }
            };
        
            const handleBlur = () => {
                if (socket) {
                    socket.emit('user_inactive');
                }
            };
        
            window.addEventListener('focus', handleFocus);
            window.addEventListener('blur', handleBlur);
        
            return () => {
                window.removeEventListener('focus', handleFocus);
                window.removeEventListener('blur', handleBlur); 
            };
        }, [socket]);

        const handleEditMessage = async (messageId, newContent) => {
            try {
                const { data } = await api.put(`/messages/${messageId}`, { content: newContent });
                
                setMessages(prev =>
                    prev.map(msg => (msg._id === messageId ? data : msg))
                );
        
                // Emit to socket with receiver ID
                if (socket && selectedUser) {
                    socket.emit('edit_message', { 
                        messageId, 
                        newContent,
                        receiverId: selectedUser 
                    });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error editing message');
                throw error;
            }
        };
    
        const handleDeleteMessage = async (messageId) => {
            try {
                const { data } = await api.delete(`/messages/${messageId}`);

                setMessages(prev =>
                    prev.map(msg => (msg._id === messageId ? data : msg))
                );

                // Emit to socket with receiver ID
                if (socket && selectedUser) {
                    socket.emit('delete_message', { 
                        messageId,
                        receiverId: selectedUser 
                    });
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error deleting message');
                throw error;
            }
        };

            useEffect(() => {
                if (!user) return;

                const newSocket = io('http://localhost:5000', {
                    auth: { token: user.token },
                });

            setSocket(newSocket);

            // User status events
            newSocket.on('user_status_change', ({ userId, isOnline, lastSeen }) => {
                setOnlineUsers(prev => ({
                    ...prev,
                    [userId]: { isOnline, lastSeen },
                }));
            });

            // Load messages for selected user when socket connects
            if (selectedUser) {
                fetchMessages(selectedUser);
            }

            // Message events
            newSocket.on('message_sent', (message) => {
                setMessages(prev => [...prev, message]);
            });

            newSocket.on('receive_message', (message) => {
                setMessages(prev => [...prev, message]);
                if (selectedUser !== message.sender._id) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [message.sender._id]: (prev[message.sender._id] || 0) + 1,
                    }));
                } else {
                    newSocket.emit('message_read', {
                        messageId: message._id,
                        senderId: message.sender._id,
                    });
                }
            });

            newSocket.on('message_status_update', ({ messageId, status }) => {
                setMessages(prev =>
                    prev.map(msg => (msg._id === messageId ? { ...msg, status } : msg))
                );
            });

        // Update message event handlers
    // Update message event handlers
    newSocket.on('message_edited', ({ messageId, newContent }) => {
        setMessages(prev =>
            prev.map(msg =>
                msg._id === messageId
                    ? { ...msg, content: newContent, isEdited: true }
                    : msg
            )
        );
    });



        // Message delete handler
=======
    const [friendRemoved, setFriendRemoved] = useState(false);

    // Window focus handling
    useEffect(() => {
        if (!socket) return;

        const handleFocus = () => socket.emit('user_active');
        const handleBlur = () => socket.emit('user_inactive');
        
        window.addEventListener('focus', handleFocus);
        window.addEventListener('blur', handleBlur);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            window.removeEventListener('blur', handleBlur);
        };
    }, [socket]);


    useEffect(() => {
        console.log('friendRemoved changed:', friendRemoved);
      }, [friendRemoved]);

    // Socket initialization and main event listeners
    useEffect(() => {
        if (!user) return;

        const newSocket = io('http://localhost:5000', {
            auth: { token: user.token },
        });

        setSocket(newSocket);

        // User status events
        newSocket.on('user_status_change', ({ userId, isOnline, lastSeen }) => {
            setOnlineUsers(prev => ({
                ...prev,
                [userId]: { isOnline, lastSeen },
            }));
        });

        // Message events
        newSocket.on('message_sent', message => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('receive_message', message => {
            setMessages(prev => [...prev, message]);
            if (selectedUser !== message.sender._id) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [message.sender._id]: (prev[message.sender._id] || 0) + 1,
                }));
            } else {
                newSocket.emit('message_read', {
                    messageId: message._id,
                    senderId: message.sender._id,
                });
            }
        });

        newSocket.on('message_status_update', ({ messageId, status }) => {
            setMessages(prev =>
                prev.map(msg => (msg._id === messageId ? { ...msg, status } : msg))
            );
        });

        // Message modification events
        newSocket.on('message_edited', ({ messageId, newContent }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId
                        ? { ...msg, content: newContent, isEdited: true }
                        : msg
                )
            );
        });

>>>>>>> feature/darkmode-bugfix
        newSocket.on('message_deleted', ({ messageId }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId
                        ? { ...msg, isDeleted: true, content: 'This message was deleted' }
                        : msg
                )
            );
        });

<<<<<<< HEAD

            newSocket.on('message_reaction_update', ({ messageId, reactions }) => {
                setMessages(prev =>
                    prev.map(msg =>
                        msg._id === messageId ? { ...msg, reactions } : msg
                    )
                );
            });

            // Typing status events
            newSocket.on('typing_status', ({ userId, isTyping }) => {
                setTypingUsers(prev => {
                    const newSet = new Set(prev);
                    if (isTyping) {
                        newSet.add(userId);
                    } else {
                        newSet.delete(userId);
                    }
                    return newSet;
                });
            });

            // Friend request events
            newSocket.on('friend_request_received', (data) => {
                toast.info(`New friend request from ${data.username}`);
                fetchPendingRequests();
            });

            newSocket.on('friend_request_updated', (data) => {
                toast.info(`Friend request ${data.accepted ? 'accepted' : 'rejected'}`);
                fetchFriends();
            });

            // Error handling
            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                toast.error('Connection error. Please check your internet connection.');
            });

            // Cleanup function
            return () => {
                newSocket.off('user_status_change');
                newSocket.off('message_sent');
                newSocket.off('receive_message');
                newSocket.off('message_status_update');
                newSocket.off('message_edited');
                newSocket.off('message_deleted');
                newSocket.off('message_reaction_update');
                newSocket.off('typing_status');
                newSocket.off('friend_request_received');
                newSocket.off('friend_request_updated');
                newSocket.off('connect_error');
                
                newSocket.close();
            };
        }, [user, selectedUser, fetchPendingRequests, fetchFriends, selectedUser]);

        // Reset unread messages for a user
        useEffect(() => {
            if (selectedUser && socket && messages.length > 0) {
            const unreadMessages = messages.filter(
                msg => msg.sender._id === selectedUser && msg.status !== 'read'
            );

            unreadMessages.forEach(msg => {
                socket.emit('message_read', {
                    messageId: msg._id,
                    senderId: msg.sender._id,
                });
            });

            setUnreadCounts(prev => ({ ...prev, [selectedUser]: 0 }));
        }
        }, [selectedUser, messages]);

// Load selected user from localStorage on mount
        useEffect(() => {
            const savedUserId = localStorage.getItem(SELECTED_USER_KEY);
            if (savedUserId) {
                setSelectedUser(savedUserId);
            }
        }, []);


    // Save selected user to localStorage when it changes
        useEffect(() => {
            if (selectedUser) {
                localStorage.setItem(SELECTED_USER_KEY, selectedUser);
            }
            }, [selectedUser]);
    
        const fetchMessages = async (userId) => {
=======
        newSocket.on('message_reaction_update', ({ messageId, reactions }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId ? { ...msg, reactions } : msg
                )
            );
        });

        // Friend-related events
        newSocket.on('friend_request_received', data => {
            toast.info(`New friend request from ${data.username}`);
            fetchPendingRequests();
        });

        newSocket.on('friend_request_response', data => {
            toast.info(`Friend request ${data.accepted ? 'accepted' : 'rejected'}`);
            fetchFriends();
        });

        newSocket.on('friend_request_accepted', data => {
            toast.success(`${data.username} accepted your friend request`);
            fetchFriends();
        });

        
        newSocket.on('friend_removed', ({ username, userId }) => {
            toast.info(`${username} removed you from their friends list`);
            // console.log('Now in friend_removed state');
            // console.log('selectedUser:', selectedUser, 'userId:', userId);
            if (selectedUser === userId) {
                // console.log('selectedUser was equal to userId');
                setFriendRemoved(true); // Set to true when removed
                console.log('Changed the value of friendRemoved to:', friendRemoved);
                setMessages([]); // Clear messages
            }
            setTimeout(() => {
                fetchFriends();
            }, 5000);
        });

        if (selectedUser) {
            setFriendRemoved(false);
        }


        // Typing status
        newSocket.on('typing_status', ({ userId, isTyping }) => {
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                if (isTyping) {
                    newSet.add(userId);
                } else {
                    newSet.delete(userId);
                }
                return newSet;
            });
        });

        // Error handling
        newSocket.on('connect_error', error => {
            console.error('Socket connection error:', error);
            toast.error('Connection error. Please check your internet connection.');
        });

        // Load messages for selected user when socket connects
        if (selectedUser) {
            fetchMessages(selectedUser);
        }

        // Cleanup
        return () => {
            newSocket.removeAllListeners();
            newSocket.close();
        };
    }, [user, selectedUser, fetchPendingRequests, fetchFriends]);

    // Message handling functions
    const handleEditMessage = async (messageId, newContent) => {
        try {
            const { data } = await api.put(`/messages/${messageId}`, { content: newContent });
            setMessages(prev =>
                prev.map(msg => (msg._id === messageId ? data : msg))
            );
            
            if (socket && selectedUser) {
                socket.emit('edit_message', { 
                    messageId, 
                    newContent,
                    receiverId: selectedUser 
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error editing message');
            throw error;
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            const { data } = await api.delete(`/messages/${messageId}`);
            setMessages(prev =>
                prev.map(msg => (msg._id === messageId ? data : msg))
            );

            if (socket && selectedUser) {
                socket.emit('delete_message', { 
                    messageId,
                    receiverId: selectedUser 
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting message');
            throw error;
        }
    };

    const sendMessage = async (content, type = 'text', replyToId = null) => {
        if (!selectedUser || !content.trim() || !socket) return;
        
        const messageData = { 
            content, 
            type, 
            replyTo: replyToId,
            receiver: selectedUser 
        };
        socket.emit('private_message', { to: selectedUser, message: messageData });
    };

    const handleTyping = () => {
        if (selectedUser && socket) {
            socket.emit('typing_start', selectedUser);
        }
    };

    const handleSelectUser = async (userId) => {
        setSelectedUser(userId);
        setFriendRemoved(false); 
        
        if (userId) {
            await fetchMessages(userId);
        }
    };

    // Local storage handling
    useEffect(() => {
        const savedUserId = localStorage.getItem(SELECTED_USER_KEY);
        if (savedUserId) {
            setSelectedUser(savedUserId);
        }
    }, []);

    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem(SELECTED_USER_KEY, selectedUser);
        }
    }, [selectedUser]);

    // Message fetching
    const fetchMessages = async (userId) => {
>>>>>>> feature/darkmode-bugfix
        try {
            setLoading(true);
            const { data } = await api.get(`/messages/${userId}`);
            setMessages(data);
            setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
        } catch (error) {
            console.error('Error fetching messages:', error);
<<<<<<< HEAD
=======
            toast.error('Failed to fetch messages');
>>>>>>> feature/darkmode-bugfix
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const sendMessage = async (content, type = 'text', replyToId = null) => {
        if (!selectedUser || !content.trim()) return;
        
        console.log('Sending message:', content, type, replyToId);
        const messageData = { 
            content, 
            type, 
            replyTo: replyToId, // This should be just the ID
            receiver: selectedUser 
        };
        console.log('Sending message:', messageData);
        socket.emit('private_message', { to: selectedUser, message: messageData });
    };

    const handleTyping = () => {
        if (selectedUser) {
            socket.emit('typing_start', selectedUser);
        }
    };

    
    // Modify the setSelectedUser function
    const handleSelectUser = async (userId) => {
        setSelectedUser(userId);
        if (userId) {
            await fetchMessages(userId);
        }
    };

=======
>>>>>>> feature/darkmode-bugfix
    return (
        <ChatContext.Provider
            value={{
                socket,
                onlineUsers,
                selectedUser,
<<<<<<< HEAD
                setSelectedUser,
                messages,
                setMessages,
=======
                messages,
>>>>>>> feature/darkmode-bugfix
                loading,
                typingUsers,
                unreadCounts,
                setUnreadCounts,
                fetchMessages,
                sendMessage,
                handleTyping,
                handleEditMessage,
                setSelectedUser: handleSelectUser,
                handleDeleteMessage,
<<<<<<< HEAD
=======
                 friendRemoved

                
>>>>>>> feature/darkmode-bugfix
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

<<<<<<< HEAD
export const useChat = () => useContext(ChatContext);
=======
export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};
>>>>>>> feature/darkmode-bugfix
