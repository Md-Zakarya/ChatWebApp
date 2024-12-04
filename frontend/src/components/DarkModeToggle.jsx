// src/components/DarkModeToggle.jsx
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            initial={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className={`
                p-2 rounded-full transition-all duration-300 ease-in-out
                flex items-center justify-center
                ${darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'}
                transform hover:rotate-12
                focus:outline-none focus:ring-2 focus:ring-offset-2 
                ${darkMode ? 'focus:ring-gray-600' : 'focus:ring-indigo-500'}
            `}
            aria-label="Toggle dark mode"
        >
            <motion.div
                initial={false}
                animate={{ rotate: darkMode ? 180 : 0 }}
                transition={{ duration: 0.4 }}
            >
                {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </motion.div>
        </motion.button>
    );
}