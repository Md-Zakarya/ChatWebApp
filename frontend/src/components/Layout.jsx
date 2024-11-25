// src/components/Layout.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
                {children}
            </main>
        </div>
    );
}