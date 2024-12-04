// frontend/src/components/Chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import MessageBubble from './MessageBubble';
import api from '../../services/axios';
import { toast } from 'react-toastify'; 
<<<<<<< HEAD
=======
import SuggestionBubbles from './SuggestionBubbles';
import { useTheme } from '../../context/ThemeContext';
import { useFriend } from '../../context/FriendContext';
>>>>>>> feature/darkmode-bugfix

export default function ChatWindow() {
    const [newMessage, setNewMessage] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const lastMessageRef = useRef(null);
<<<<<<< HEAD
=======
    const { darkMode } = useTheme();

>>>>>>> feature/darkmode-bugfix
    const {
        socket,
        selectedUser,
        messages,
        loading,
        typingUsers,
        sendMessage,
        handleTyping,
        setMessages,
<<<<<<< HEAD
        handleDeleteMessage  // Add this here
    } = useChat();
    const { user } = useAuth();
    const { handleEditMessage } = useChat();
    
=======
        handleDeleteMessage, 
        friendRemoved, 
        onlineUsers, 
    } = useChat();
    const { user } = useAuth();
    const { handleEditMessage } = useChat();
    const { friends } = useFriend();
    const [suggestions, setSuggestions] = useState([]);


    const fetchSuggestions = async () => {
        if (!selectedUser || !messages.length) return;
        
        try {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender._id === user._id) return;
    
            // Sanitize and filter content
            const sanitizeContent = (text) => {
                if (!text) return '';
                return text
                    .replace(/[^a-zA-Z0-9\s.,!?]/g, '') // Remove special chars
                    .substring(0, 30); // Strict length limit
            };
            
            // Minimal, sanitized context
            const chatContext = {
                messageContent: sanitizeContent(lastMessage.content),
                chatHistory: messages.slice(-2).map(msg => ({
                    content: sanitizeContent(msg.content),
                    isUser: msg.sender._id === user._id
                })),
                minSuggestions: 5
            };
    
            const { data } = await api.post('/messages/suggest-reply', chatContext);
            
            setSuggestions(data.suggestions || []);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]); // Fallback to empty suggestions
        }
    };


    useEffect(() => {
        if (messages.length) {
            fetchSuggestions();
        }
    }, [messages]);
    



    // Get the full user object for the selected user
    const selectedUserObject = friends.find(friend => friend._id === selectedUser);

>>>>>>> feature/darkmode-bugfix
    // Auto-scroll to bottom on new messages
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

<<<<<<< HEAD
=======
    useEffect(() => {
        console.log('friendRemoved state changed:', friendRemoved);
    }, [friendRemoved]);

>>>>>>> feature/darkmode-bugfix
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        try {
            // Send message with reply reference if replying
<<<<<<< HEAD

            console.log('Reply to:', replyTo, replyTo?._id);
           
=======
>>>>>>> feature/darkmode-bugfix
            sendMessage(
                newMessage,
                'text',
                replyTo?._id // Pass the reply message ID
            );
<<<<<<< HEAD
            // console.log('Reply to:', replyTo, replyTo?._id);
=======
>>>>>>> feature/darkmode-bugfix
            setNewMessage('');
            setReplyTo(null); // Clear reply state after sending
        } catch (error) {
            toast.error('Failed to send message');
            console.error('Error sending message:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

<<<<<<< HEAD

    ///reaction handling for the message
=======
    // Reaction handling for the message
>>>>>>> feature/darkmode-bugfix
    const handleReaction = async (messageId, emoji) => {
        try {
            const { data: reactions } = await api.post(`/messages/${messageId}/react`, { emoji });
            
            // Update local state
            setMessages(prevMessages => 
                prevMessages.map(msg => 
                    msg._id === messageId 
                        ? { ...msg, reactions }
                        : msg
                )
            );
    
            // Emit socket event for real-time update
            socket.emit('message_reaction', { messageId, emoji });
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    };
<<<<<<< HEAD
   
=======
    
>>>>>>> feature/darkmode-bugfix
    const handleEdit = async (message) => {
        try {
            const newContent = prompt('Edit message:', message.content);
            if (newContent && newContent !== message.content) {
                await handleEditMessage(message._id, newContent);
            }
        } catch (error) {
            console.error('Error editing message:', error);
            toast.error('Failed to edit message');
        }
    };
    
    const handleDelete = async (messageId) => {
        try {
            if (window.confirm('Are you sure you want to delete this message?')) {
                await handleDeleteMessage(messageId);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

<<<<<<< HEAD
    useEffect(() => {
        const handleFocus = () => {
            if (socket) {
                socket.emit('user_active');
            }
        };
    
        window.addEventListener('focus', handleFocus);
    
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [socket]);
  

    if (loading) return <div className="flex-1 flex justify-center items-center"><LoadingSpinner /></div>;

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white border-b flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Chat</h2>
                    {typingUsers.has(selectedUser) && (
                        <p className="text-sm text-gray-500">Typing...</p>
                    )}
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                      <MessageBubble
                      key={message._id} 
                      message={{
                          ...message,
                          canEdit: message.sender._id === user._id && !message.isDeleted,
                          canDelete: message.sender._id === user._id && !message.isDeleted
                      }}
                      isOwnMessage={message.sender._id === user._id}
                      onReply={setReplyTo}
                      onReact={handleReaction}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      
                  />
=======
    if (loading) return <div className="flex-1 flex justify-center items-center"><LoadingSpinner /></div>;

    return (
        <div className={`min-h-screen flex-1 flex flex-col ${
            darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
           {/* Chat Header */}
<div className={`px-6 py-4 flex items-center justify-between border-b ${
    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
}`}>
    {/* User Info Section */}
    <div className="flex items-center space-x-4">
        {/* Avatar with Online Status */}
        <div className="relative">
            <img 
                src={selectedUserObject?.avatar || '/default-avatar.png'}
                alt={selectedUserObject?.username}
                className="w-12 h-12 rounded-full border-2 dark:border-gray-700"
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                darkMode ? 'border-gray-800' : 'border-white'
            } ${onlineUsers[selectedUser]?.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
        </div>
        
        {/* Username and Status */}
        <div>
            <h2 className={`font-semibold text-lg ${
                darkMode ? 'text-gray-100' : 'text-gray-900'
            }`}>
                {selectedUserObject?.username}
            </h2>
            <div className="flex items-center">
                {typingUsers.has(selectedUser) ? (
                    <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Typing...</p>
                ) : (
                    <p className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {onlineUsers[selectedUser]?.isOnline ? 'Online' : 'Offline'}
                    </p>
                )}
            </div>
        </div>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center space-x-2">
        <button 
            className={`p-2 rounded-full transition-colors ${
                darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Search in conversation"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
        <button 
            className={`p-2 rounded-full transition-colors ${
                darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Voice call"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        </button>
        <button 
            className={`p-2 rounded-full transition-colors ${
                darkMode 
                    ? 'hover:bg-gray-700 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Video call"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        </button>
    </div>
</div>
            {/* Messages Area */}
            <div className={`flex-1 p-4 overflow-y-auto ${
                darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <MessageBubble
                            key={message._id} 
                            message={{
                                ...message,
                                canEdit: message.sender._id === user._id && !message.isDeleted,
                                canDelete: message.sender._id === user._id && !message.isDeleted
                            }}
                            isOwnMessage={message.sender._id === user._id}
                            onReply={setReplyTo}
                            onReact={handleReaction}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            darkMode={darkMode}
                        />
>>>>>>> feature/darkmode-bugfix
                    ))}
                    <div ref={lastMessageRef} />
                </div>
            </div>
<<<<<<< HEAD

            {/* Reply Preview */}
            {replyTo && (
            <div className="bg-gray-100 p-3 flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-500">
                        Replying to {replyTo.sender?.username}:
                    </p>
                    <p className="text-sm truncate">{replyTo.content}</p>
                </div>
                <button
                    onClick={() => setReplyTo(null)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>
            </div>
        )}

            {/* Message Input */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
                <div className="flex space-x-4">
                    <textarea
                        value={newMessage}
                        onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping();
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                        rows="1"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </form>
=======
        
            {/* Reply Preview */}
            {replyTo && (
                <div className={`p-3 flex items-center justify-between ${
                    darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                    <div className="flex-1">
                        <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            Replying to {replyTo.sender?.username}:
                        </p>
                        <p className={`text-sm truncate ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            {replyTo.content}
                        </p>
                    </div>
                    <button
                        onClick={() => setReplyTo(null)}
                        className={`ml-2 ${
                            darkMode 
                                ? 'text-gray-400 hover:text-gray-200' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        ×
                    </button>
                </div>
            )}
          <div className="px-4">
        <SuggestionBubbles
            suggestions={suggestions}
            onSelect={(suggestion) => {
                setNewMessage(suggestion);
                setSuggestions([]); // Clear suggestions after selection
            }}
            darkMode={darkMode}
        />
    </div>
            {/* Message Input */}
            {!friendRemoved ? (
                <form onSubmit={handleSubmit} className={`p-4 border-t flex items-center ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className={`flex-1 p-2 rounded-md focus:outline-none transition-colors ${
                            darkMode 
                                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-400' 
                                : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                        }`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleTyping}
                    />
                    <button
                        type="submit"
                        className={`ml-2 px-4 py-2 rounded-md transition-colors ${
                            darkMode
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-indigo-500 hover:bg-indigo-600'
                        } text-white disabled:opacity-50`}
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </button>
                </form>
            ) : (
                <div className={`p-4 text-center ${
                    darkMode ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-700'
                }`}>
                    <p>You have been removed from this chat.</p>
                    <button
                        onClick={() => navigateToFriendsList()}
                        className={`mt-2 px-4 py-2 rounded-md text-white transition-colors ${
                            darkMode
                                ? 'bg-indigo-600 hover:bg-indigo-700'
                                : 'bg-indigo-500 hover:bg-indigo-600'
                        }`}
                    >
                        Go to Friends List
                    </button>
                </div>
            )}
>>>>>>> feature/darkmode-bugfix
        </div>
    );
}