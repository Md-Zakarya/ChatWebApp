// src/components/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const { darkMode, setDarkMode } = useTheme();
    const { login, loading, error } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData.email, formData.password);
    };

    return (
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
                            Welcome Back
                        </h2>
                        <p className={`${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                        } mb-6`}>
                            Sign in to continue to ChatApp
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
                            <div>
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
                            </div>
                            
                            <div>
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
                                    Signing in...
                                </div>
                            ) : 'Sign in'}
                        </button>

                        <div className={`text-center mt-4 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Register here
                            </Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
}