// src/components/Layout.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD

export function Layout({ children }) {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-indigo-600 text-white p-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold">ChatApp</Link>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span>Welcome, {user.username}</span>
                            <button 
                                onClick={logout}
                                className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-400"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-indigo-200">Login</Link>
                            <Link to="/register" className="hover:text-indigo-200">Register</Link>
                        </div>
                    )}
                </div>
            </nav>
            <main className="max-w-7xl mx-auto p-4">
=======
import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export function Layout({ children }) {
    const { user, logout } = useAuth();
 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { darkMode, toggleTheme } = useTheme();

  
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-opacity-95 backdrop-blur-sm shadow-lg' 
                    : 'bg-opacity-100'
                } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                                ChatApp
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button
                                 onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                            </button>
                            
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="font-medium">Welcome, {user.username}</span>
                                    <button 
                                        onClick={logout}
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg
                                        hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        to="/login" 
                                        className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg
                                        hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-md focus:outline-none"
                        >
                            {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className={`px-2 pt-2 pb-3 space-y-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            {user ? (
                                <>
                                    <div className="px-4 py-2">Welcome, {user.username}</div>
                                    <button 
                                        onClick={logout}
                                        className="w-full text-left px-4 py-2 text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto p-4 pt-20">
>>>>>>> feature/darkmode-bugfix
                {children}
            </main>
        </div>
    );
}