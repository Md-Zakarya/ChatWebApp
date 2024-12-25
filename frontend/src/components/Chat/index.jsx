import { useState, useEffect, useRef } from 'react';
import UsersList from './UsersList';
import ChatWindow from './ChatWindow';
import { useChat } from '../../context/ChatContext';
import LoadingSpinner from '../LoadingSpinner';
import { useTheme } from '../../context/ThemeContext';

export default function Chat() {
    const { selectedUser, loading } = useChat();
    const { darkMode } = useTheme();
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle touch events for swipe
    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].screenX;
        handleSwipe();
    };

    const handleSwipe = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const deltaX = touchStartX.current - touchEndX.current;
        const threshold = 50; // Minimum swipe distance

        if (deltaX > threshold) {
            // Swipe left
            setSidebarOpen(false);
        } else if (deltaX < -threshold) {
            // Swipe right
            setSidebarOpen(true);
        }
        touchStartX.current = null;
        touchEndX.current = null;
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div 
            className={`flex flex-col md:flex-row h-[100vh] relative ${darkMode ? 'dark' : ''}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Sidebar with responsive transitions */}
            <div 
                className={`transition-all duration-300 ease-in-out fixed md:relative z-40
                    ${isSidebarOpen ? 'w-full md:w-80 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'}
                    h-full overflow-hidden bg-white dark:bg-gray-900`}
            >
                <UsersList />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className={`fixed top-1/2 left-4 transform -translate-y-1/2 md:absolute md:top-1/2 
                    ${isSidebarOpen ? 'right-4 md:left-72' : 'left-4'}
                    z-50 w-10 h-10 rounded-full shadow-lg transition-all duration-300
                    flex items-center justify-center
                    ${darkMode 
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700' 
                        : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
                <svg 
                    className={`w-6 h-6 transition-transform duration-300 ${
                        isSidebarOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d={isSidebarOpen 
                            ? "M15 19l-7-7 7-7"
                            : "M9 5l7 7-7 7"
                        }
                    />
                </svg>
            </button>

            {/* Main Content */}
            <div className="flex-1 w-full">
                {selectedUser ? (
                    <ChatWindow />
                ) : (
                    <div className="flex-1 h-[100vh] flex items-center justify-center bg-white dark:bg-gray-800">
                        <p className="text-gray-500 dark:text-gray-300 text-center px-4">
                            Select a user to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}