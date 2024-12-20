// frontend/src/components/Chat/MessageActions.jsx
import { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';

const EMOJI_REACTIONS = ['👍', '❤️', '😊', '😂', '😮', '😢'];

export default function MessageActions({ message, isOwnMessage, onReact, onEdit, onDelete }) {
    const [showReactions, setShowReactions] = useState(false);
    const actionsRef = useRef();
    
    useClickOutside(actionsRef, () => setShowReactions(false));

    if (message.isDeleted) {
        return null;
    }

    return (
        <div className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} top-0 opacity-0 group-hover:opacity-100 transition-opacity z-50`} ref={actionsRef}>
           <div
    className={`absolute top-0 ${
        isOwnMessage ? 'left-0 ml-[-40px]' : 'right-0 mr-[-40px]'
    } flex items-center space-x-1 bg-white shadow-sm rounded px-1`}
>
    <button
        onClick={() => setShowReactions(!showReactions)}
        className="p-1 hover:bg-gray-100 rounded text-gray-600"
        title="React"
    >
        😊
    </button>
    {isOwnMessage && !message.isDeleted && (
        <>
            <button
                onClick={() => {
                    try {
                        onEdit(message);
                    } catch (error) {
                        console.error('Error handling edit:', error);
                    }
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                title="Edit"
            >
                ✏️
            </button>
            <button
                onClick={() => {
                    try {
                        onDelete(message._id);
                    } catch (error) {
                        console.error('Error handling delete:', error);
                    }
                }}
                className="p-1 hover:bg-gray-100 rounded text-gray-600"
                title="Delete"
            >
                🗑️
            </button>
        </>
    )}
            </div>
            {showReactions && (
    <div
        className={`absolute -top-10 ${
            isOwnMessage ? 'right-0' : 'left-0'
        } bg-white shadow-lg rounded-lg p-2 flex space-x-1 z-[1000]`}
    >
        {EMOJI_REACTIONS.map((emoji) => (
            <button
                key={emoji}
                onClick={() => {
                    onReact(emoji);
                    setShowReactions(false);
                }}
                className="hover:bg-gray-100 p-2 rounded text-lg"
            >
                {emoji}
            </button>
        ))}
    </div>
)}
        </div>
    );
}