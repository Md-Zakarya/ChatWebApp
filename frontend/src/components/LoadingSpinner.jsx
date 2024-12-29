import React, { useState } from 'react';

export default function LoadingSpinner() {
    const colors = ['indigo', 'purple', 'blue', 'teal', 'green'];
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const handleClick = () => {
        setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
            <div 
                className={`animate-spin rounded-full h-12 w-12 border-4 border-${colors[currentColorIndex]}-600 border-t-transparent cursor-pointer`}
                onClick={handleClick}
                title="Click to change spinner color"
            ></div>
        </div>
    );
}