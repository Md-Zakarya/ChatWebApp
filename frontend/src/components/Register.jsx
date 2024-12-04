<<<<<<< HEAD

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
=======
// src/components/Register.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';
>>>>>>> feature/darkmode-bugfix

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
<<<<<<< HEAD
=======
    
    const { darkMode } = useTheme();
>>>>>>> feature/darkmode-bugfix
    const { register, loading, error } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        await register(formData.username, formData.email, formData.password);
    };

    return (
<<<<<<< HEAD
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Register your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className="rounded-md shadow-sm -space-y-px">
                        <input
                            type="text"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Username"
                            value={formData.username}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        <input
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <input
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
=======
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`min-h-screen flex items-center justify-center ${
                darkMode ? 'bg-gray-900' : 'bg-gray-50'
            }`}
        >
            <div className="max-w-md w-full mx-4">
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className={`${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                    } p-8 rounded-lg shadow-xl`}
                >
                      <div className="flex justify-end mb-4">
                        <DarkModeToggle />
                    </div>

                    <div className="text-center">
                        <h2 className={`text-3xl font-extrabold ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        } mb-2`}>
                            Create Account
                        </h2>
                        <p className={`${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                        } mb-6`}>
                            Join ChatApp today
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative">
                                <FiUser className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="text"
                                    required
                                    className={`pl-10 w-full px-4 py-2 rounded-lg border ${
                                        darkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                />
                            </div>

                            <div className="relative">
                                <FiMail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="email"
                                    required
                                    className={`pl-10 w-full px-4 py-2 rounded-lg border ${
                                        darkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="relative">
                                <FiLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="password"
                                    required
                                    className={`pl-10 w-full px-4 py-2 rounded-lg border ${
                                        darkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                            </div>

                            <div className="relative">
                                <FiLock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                                    darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="password"
                                    required
                                    className={`pl-10 w-full px-4 py-2 rounded-lg border ${
                                        darkMode 
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg text-white font-medium 
                                ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                                transform transition-all duration-200 hover:scale-[1.02]
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Creating account...
                                </div>
                            ) : 'Create Account'}
                        </button>

                        <div className={`text-center mt-4 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Sign in here
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
>>>>>>> feature/darkmode-bugfix
    );
}