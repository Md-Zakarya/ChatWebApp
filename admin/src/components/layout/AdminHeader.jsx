import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { XIcon, MenuIcon, BellIcon, UserCircleIcon, MoonIcon, SunIcon } from '@heroicons/react/outline';

export default function AdminHeader({ onSidebarToggle }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { admin, logout } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center">
                    <button
                        onClick={() => {
                            setSidebarOpen(!sidebarOpen);
                            onSidebarToggle?.(!sidebarOpen);
                        }}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? (
                            <XIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <MenuIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>
                    <h1 className="hidden md:block text-xl font-semibold text-gray-800 dark:text-white ml-4">
                        Admin Dashboard
                    </h1>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <button 
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200"
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? (
                            <SunIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <MoonIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors duration-200">
                            <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                                2
                            </span>
                        </button>
                    </div>

                    {/* Profile & Logout Section */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center space-x-3 focus:outline-none"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {admin?.email}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Administrator
                                </p>
                            </div>
                            <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                >
                                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}