<<<<<<< HEAD
import MessageActions from './MessageActions';
// MessageBubble.jsx
export default function MessageBubble({ message, isOwnMessage, onReply, onReact, onEdit, onDelete }) {
    // console.log('MessageBubble message:', message); 

    // console.log('Message data:', {
    //     id: message._id,
    //     content: message.content,
    //     replyTo: message.replyTo,
    //     hasReply: !!message.replyTo
    // });

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'} relative group`}>
                {/* Main message container */}
                <div
                    className={`
                        relative px-4 py-2 rounded-lg
                        ${message.replyTo ? 'mt-3' : ''} 
                        ${isOwnMessage 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-white border shadow-sm'
                        }
                    `}
                >
                    {/* Reply quote section */}
                    {message.replyTo && message.replyTo.content && (
    <div className={`
        relative mb-3 group
        rounded-lg overflow-hidden
        transition-all duration-200 hover:opacity-90
        ${isOwnMessage 
            ? 'bg-indigo-600/30' 
            : 'bg-gray-50 border border-gray-200'
        }
    `}>
        <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                    isOwnMessage ? 'bg-indigo-300' : 'bg-gray-400'
                }`}/>
                <span className={`text-xs font-semibold ${
                    isOwnMessage ? 'text-indigo-100' : 'text-gray-600'
                }`}>
                    {message.replyTo?.sender?.username}
                </span>
            </div>
            <p className={`
                text-xs pl-3.5 line-clamp-1
                ${isOwnMessage ? 'text-indigo-100/90' : 'text-gray-500'}
            `}>
                {message.replyTo.content}
            </p>
        </div>
        <div className={`
            absolute bottom-[-8px] left-4
            w-3 h-3 rotate-45 transition-all
            ${isOwnMessage 
                ? 'bg-indigo-600/30' 
                : 'bg-gray-50 border-r border-b border-gray-200'
            }
        `}/>
    </div>
)}                {/* Main message content */}
=======
// frontend/src/components/Chat/MessageBubble.jsx
import MessageActions from './MessageActions';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion'; // Add smooth animations

export default function MessageBubble({ message, isOwnMessage, onReply, onReact, onEdit, onDelete }) {
    const { darkMode } = useTheme();

    const bubbleVariants = {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        hover: { scale: 1.01 }
    };

    return (
        <motion.div 
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
            initial="initial"
            animate="animate"
            whileHover="hover"
            variants={bubbleVariants}
            transition={{ duration: 0.2 }}
        >
            <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'} relative group`}>
                <div className={`
                    relative px-4 py-2 rounded-2xl shadow-md
                    transition-all duration-200
                    ${message.replyTo ? 'mt-3' : ''} 
                    ${isOwnMessage 
                        ? darkMode 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-indigo-500 text-white'
                        : darkMode
                            ? 'bg-gray-800 text-gray-100'
                            : 'bg-white text-gray-800 border border-gray-100'
                    }
                `}>
                    {/* Reply quote section */}
                    {message.replyTo && message.replyTo.content && (
                        <div className={`
                            relative mb-3 group rounded-xl
                            overflow-hidden backdrop-blur-sm
                            transition-all duration-200 hover:opacity-90
                            ${isOwnMessage 
                                ? 'bg-indigo-700/40' 
                                : darkMode
                                    ? 'bg-gray-700/50'
                                    : 'bg-gray-50 border border-gray-200'
                            }
                        `}>
                            <div className="px-3 py-2">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        isOwnMessage ? 'bg-indigo-300' : darkMode ? 'bg-gray-400' : 'bg-gray-500'
                                    }`}/>
                                    <span className={`text-xs font-medium ${
                                        isOwnMessage ? 'text-indigo-100' : darkMode ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {message.replyTo?.sender?.username}
                                    </span>
                                </div>
                                <p className={`
                                    text-xs pl-3.5 line-clamp-1
                                    ${isOwnMessage 
                                        ? 'text-indigo-100/90' 
                                        : darkMode 
                                            ? 'text-gray-400'
                                            : 'text-gray-500'
                                    }
                                `}>
                                    {message.replyTo.content}
                                </p>
                            </div>
                            <div className={`
                                absolute bottom-[-8px] left-4
                                w-3 h-3 rotate-45 transition-all
                                ${isOwnMessage 
                                    ? 'bg-indigo-700/40' 
                                    : darkMode
                                        ? 'bg-gray-700/50'
                                        : 'bg-gray-50 border-r border-b border-gray-200'
                                }
                            `}/>
                        </div>
                    )}

                    {/* Main message content */}
>>>>>>> feature/darkmode-bugfix
                    <div className="relative">
                        <div className="whitespace-pre-wrap break-words">
                            {message.content}
                        </div>

                        {/* Reactions */}
                        {message.reactions?.length > 0 && (
<<<<<<< HEAD
                            <div className="flex flex-wrap gap-1 mt-2">
=======
                            <div className="flex flex-wrap gap-1.5 mt-2">
>>>>>>> feature/darkmode-bugfix
                                {Object.entries(
                                    message.reactions.reduce((acc, { emoji, user }) => {
                                        acc[emoji] = (acc[emoji] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).map(([emoji, count]) => (
<<<<<<< HEAD
                                    <span key={emoji} className={`
                                        text-xs px-2 py-0.5 rounded-full
                                        ${isOwnMessage 
                                            ? 'bg-indigo-400/50' 
                                            : 'bg-gray-100'
                                        }
                                    `}>
                                        {emoji} {count}
                                    </span>
=======
                                    <motion.span 
                                        key={emoji} 
                                        className={`
                                            text-xs px-2 py-0.5 rounded-full
                                            transition-colors duration-200
                                            ${isOwnMessage 
                                                ? 'bg-indigo-400/50 text-white' 
                                                : darkMode
                                                    ? 'bg-gray-700 text-gray-300'
                                                    : 'bg-gray-100 text-gray-600'
                                            }
                                        `}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        {emoji} {count}
                                    </motion.span>
>>>>>>> feature/darkmode-bugfix
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message footer */}
                <div className="flex items-center justify-between mt-1 px-1">
<<<<<<< HEAD
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        {message.isEdited && <span>• edited</span>}
                        {message.status && (
                            <span>
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
=======
                    <div className="flex items-center space-x-2 text-xs">
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}
                        </span>
                        {message.isEdited && (
                            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                • edited
                            </span>
                        )}
                        {message.status && (
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && (
                                    <span className="text-blue-500">✓✓</span>
                                )}
>>>>>>> feature/darkmode-bugfix
                            </span>
                        )}
                    </div>
                    {!message.isDeleted && (
                        <button
                            onClick={() => onReply(message)}
<<<<<<< HEAD
                            className="text-xs text-gray-500 hover:text-gray-700"
=======
                            className={`
                                text-xs px-2 py-1 rounded-full
                                transition-colors duration-200
                                ${darkMode 
                                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                }
                            `}
>>>>>>> feature/darkmode-bugfix
                        >
                            Reply
                        </button>
                    )}
                </div>
                
                <MessageActions 
                    message={message}
                    isOwnMessage={isOwnMessage}
                    onReact={(emoji) => onReact(message._id, emoji)}
                    onEdit={() => onEdit(message)}
                    onDelete={() => onDelete(message._id)}
                />
            </div>
<<<<<<< HEAD
        </div>
=======
        </motion.div>
>>>>>>> feature/darkmode-bugfix
    );
}