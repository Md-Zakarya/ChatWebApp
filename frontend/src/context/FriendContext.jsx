
// frontend/src/context/FriendContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/axios';
import { toast } from 'react-toastify';



const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFriends = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/friends');
            setFriends(data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const { data } = await api.get('/friends/requests');
            setPendingRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };
    const sendFriendRequest = async (userId) => {
        try {
            const response = await api.post(`/friends/request/${userId}`);
            if (response.status === 201) {
                toast.success(response.data.message);
                await fetchFriends(); // Refresh friends list
            }
        } catch (error) {
            if (!error.response) {
                toast.error('Network error - please check your connection');
                return;
            }
    
            const { status, data } = error.response;
    
            switch (status) {
                case 400:
                    // Handle validation errors
                    toast.warning(data.message);
                    break;
                case 404:
                    // Handle not found
                    toast.error(data.message);
                    break;
                case 500:
                    // Handle server errors
                    toast.error('Server error - please try again later');
                    break;
                default:
                    toast.error('Failed to send friend request');
            }
        }
    };
    const respondToRequest = async (userId, status) => {
        try {
            await api.put(`/friends/request/${userId}`, { status });
            // Refetch both lists
            fetchPendingRequests();
            fetchFriends();
        } catch (error) {
            console.error('Error responding to request:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchPendingRequests();
    }, []);

    return (
        <FriendContext.Provider value={{
            friends,
            pendingRequests,
            loading,
            sendFriendRequest,
            respondToRequest,
            fetchFriends,
            fetchPendingRequests
        }}>
            {children}
        </FriendContext.Provider>
    );
};

export const useFriend = () => useContext(FriendContext);