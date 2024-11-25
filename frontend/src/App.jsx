// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';  // Add this import
import { FriendProvider } from './context/FriendContext';  // Add this import
import { Layout } from './components/Layout';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';  // Replace Dashboard with Chat
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AppRoutes() {
    const { loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={  // Changed from /dashboard to /chat
                <ProtectedRoute>
                    <Chat /> 
                </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/chat" />} />  // Changed from /dashboard to /chat
        </Routes>
    );
}

function App() {
  return (
    <BrowserRouter>
        <ErrorBoundary>
            <AuthProvider>
                <FriendProvider>
                    <ChatProvider>
                        <Layout>
                            <AppRoutes />
                        </Layout>
                        <ToastContainer 
                                 position="top-right"
                                 autoClose={3000}
                                 hideProgressBar={false}
                                 newestOnTop
                                 closeOnClick
                                 rtl={false}
                                 pauseOnFocusLoss
                                 draggable
                                 pauseOnHover
                            />
                    </ChatProvider>
                </FriendProvider>
            </AuthProvider>
        </ErrorBoundary>
    </BrowserRouter>
);
}

export default App;