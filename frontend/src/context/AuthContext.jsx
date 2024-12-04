import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Check if user is logged in on initial load
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            setUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    const register = async (username, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register', {
                username,
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', {
                email,
                password,
            });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('userLoggedIn'));
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    //update the user profile
  // frontend/src/context/AuthContext.jsx
const updateProfile = async (userData) => {
    try {
        console.log('Updating profile with data:', userData);
        
        const { data } = await api.put('/auth/profile', userData);
        
        console.log('Profile update successful:', data);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
        console.error('Profile update failed:', error);
        throw error;
    }
};

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Add token validation
    const validateToken = async () => {
        try {
            await api.get('/auth/validate');
            return true;
        } catch {
            logout();
            return false;
        }
    };

    return (
        <AuthContext.Provider 
            value={{ 
                user, 
                loading, 
                error, 
                register, 
                login, 
                logout,
                validateToken,
                updateProfile 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);