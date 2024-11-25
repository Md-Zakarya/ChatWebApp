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
                    <div className="relative">
                        <div className="whitespace-pre-wrap break-words">
                            {message.content}
                        </div>

                        {/* Reactions */}
                        {message.reactions?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {Object.entries(
                                    message.reactions.reduce((acc, { emoji, user }) => {
                                        acc[emoji] = (acc[emoji] || 0) + 1;
                                        return acc;
                                    }, {})
                                ).map(([emoji, count]) => (
                                    <span key={emoji} className={`
                                        text-xs px-2 py-0.5 rounded-full
                                        ${isOwnMessage 
                                            ? 'bg-indigo-400/50' 
                                            : 'bg-gray-100'
                                        }
                                    `}>
                                        {emoji} {count}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Message footer */}
                <div className="flex items-center justify-between mt-1 px-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                        {message.isEdited && <span>• edited</span>}
                        {message.status && (
                            <span>
                                {message.status === 'sent' && '✓'}
                                {message.status === 'delivered' && '✓✓'}
                                {message.status === 'read' && '✓✓'}
                            </span>
                        )}
                    </div>
                    {!message.isDeleted && (
                        <button
                            onClick={() => onReply(message)}
                            className="text-xs text-gray-500 hover:text-gray-700"
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
        </div>
    );
}