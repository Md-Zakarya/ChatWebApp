// frontend/src/components/Chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import MessageBubble from './MessageBubble';
import api from '../../services/axios';
import { toast } from 'react-toastify'; 

export default function ChatWindow() {
    const [newMessage, setNewMessage] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const lastMessageRef = useRef(null);
    const {
        socket,
        selectedUser,
        messages,
        loading,
        typingUsers,
        sendMessage,
        handleTyping,
        setMessages,
        handleDeleteMessage, 
        friendRemoved
    } = useChat();
    const { user } = useAuth();
    const { handleEditMessage } = useChat();
    
    // Auto-scroll to bottom on new messages
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        console.log('friendRemoved state changed:', friendRemoved);
    }, [friendRemoved]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        
        try {
            // Send message with reply reference if replying

            console.log('Reply to:', replyTo, replyTo?._id);
           
            sendMessage(
                newMessage,
                'text',
                replyTo?._id // Pass the reply message ID
            );
            // console.log('Reply to:', replyTo, replyTo?._id);
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


    ///reaction handling for the message
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
                    ))}
                    <div ref={lastMessageRef} />
                </div>
            </div>

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
{!friendRemoved ? (
    <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex items-center">
        <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:border-indigo-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleTyping}
        />
        <button
            type="submit"
            className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:opacity-50"
            disabled={!newMessage.trim()}
        >
            Send
        </button>
    </form>
) : (
    <div className="p-4 bg-red-100 text-red-700 text-center">
        <p>You have been removed from this chat.</p>
        <button
            onClick={() => navigateToFriendsList()}
            className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
        >
            Go to Friends List
        </button>
    </div>
)}
        </div>
    );
}