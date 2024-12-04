// frontend/src/components/Chat/SuggestionBubbles.jsx
import React from 'react';

export default function SuggestionBubbles({ suggestions, onSelect, darkMode }) {
    if (!suggestions.length) return null;

    const cleanSuggestion = (suggestion) => {
        // Remove numbers followed by dots or dashes at the start
        return suggestion.replace(/^[\d.-]+\s*/, '');
    };

    return (
        <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map((suggestion, index) => (
                <button
                    key={index}
                    onClick={() => onSelect(cleanSuggestion(suggestion))}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                >
                    {cleanSuggestion(suggestion)}
                </button>
            ))}
        </div>
    );
}