// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { FriendProvider } from './context/FriendContext';
import { Layout } from './components/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketContext';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

function AppRoutes() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center min-h-screen"
            >
                <LoadingSpinner />
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="wait">
            <Routes>
                <Route path="/login" element={
                    <motion.div {...pageTransition}>
                        <Login />
                    </motion.div>
                } />
                <Route path="/register" element={
                    <motion.div {...pageTransition}>
                        <Register />
                    </motion.div>
                } />
                <Route path="/chat" element={
                    <ProtectedRoute>
                        <motion.div {...pageTransition}>
                            <Chat />
                        </motion.div>
                    </ProtectedRoute>
                } />
                <Route path="/" element={<Navigate to="/chat" />} />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <ThemeProvider>
                    <AuthProvider>
                        <SocketProvider>
                            <FriendProvider>
                                <ChatProvider>
                                    
                                        <AppRoutes />
                                    
                                    <ToastContainer 
                                        position="bottom-right"
                                        autoClose={3000}
                                        hideProgressBar={false}
                                        newestOnTop
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        theme="colored"
                                        toastClassName={() =>
                                            'relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
                                        }
                                        bodyClassName={() =>
                                            'text-sm font-white font-med block p-3'
                                        }
                                        progressClassName={() =>
                                            'bg-gradient-to-r from-indigo-500 to-purple-600'
                                        }
                                    />
                                </ChatProvider>
                            </FriendProvider>
                        </SocketProvider>
                    </AuthProvider>
                </ThemeProvider>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;