import { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import api from '../services/axios';
import { toast } from 'react-toastify';
import { useFriend } from './FriendContext';

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

        newSocket.on('message_deleted', ({ messageId }) => {
            setMessages(prev =>
                prev.map(msg =>
                    msg._id === messageId
                        ? { ...msg, isDeleted: true, content: 'This message was deleted' }
                        : msg
                )
            );
        });

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
        try {
            setLoading(true);
            const { data } = await api.get(`/messages/${userId}`);
            setMessages(data);
            setUnreadCounts(prev => ({ ...prev, [userId]: 0 }));
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                socket,
                onlineUsers,
                selectedUser,
                messages,
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
                 friendRemoved

                
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};