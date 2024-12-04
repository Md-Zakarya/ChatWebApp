
// frontend/src/context/FriendContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/axios';
import { toast } from 'react-toastify';
<<<<<<< HEAD

=======
import { useAuth } from './AuthContext';

import { useSocket } from './SocketContext';
>>>>>>> feature/darkmode-bugfix


const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
    const { socket } = useSocket();
    const { user } = useAuth();



    
>>>>>>> feature/darkmode-bugfix

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
<<<<<<< HEAD
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
=======
            await fetchPendingRequests();
            await fetchFriends();
            
            // Notify the sender through the socket event
            if (status === 'accepted') {
                socket.emit('friend_request_response', {
                    to: userId,
                    accepted: true
                });
            }
            
            toast.success(`Friend request ${status}`);
        } catch (error) {
            console.error('Error responding to request:', error);
            toast.error('Failed to respond to friend request');
            throw error;
        }
    };
    const removeFriend = async (userId) => {
        try {
            const response = await api.delete(`/friends/${userId}`);
            toast.success(response.data.message);
            fetchFriends();
        } catch (error) {
            console.error('Error removing friend:', error);
            toast.error('Failed to remove friend');
        }
    };

    useEffect(() => {
        // Initial fetch when component mounts
        if (user) {
            fetchFriends();
            fetchPendingRequests();
        }

        // Listen for login event
        const handleLogin = () => {
            fetchFriends();
            fetchPendingRequests();
        };

        window.addEventListener('userLoggedIn', handleLogin);

        return () => {
            window.removeEventListener('userLoggedIn', handleLogin);
        };
    }, [user]);



     // Define event handlers
  const handleFriendRequestReceived = (data) => {
    toast.info(`New friend request from ${data.username}`);
    fetchPendingRequests();
  };

  const handleFriendRequestResponse = (data) => {
    toast.info(`Friend request ${data.accepted ? 'accepted' : 'rejected'}`);
    fetchFriends();
  };

  const handleFriendRemoved = ({ username }) => {
    toast.info(`${username} removed you from their friends list`);
    fetchFriends();
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for friend events
    socket.on('friend_request_received', handleFriendRequestReceived);
    socket.on('friend_request_response', handleFriendRequestResponse);
    socket.on('friend_removed', handleFriendRemoved);

    return () => {
      socket.off('friend_request_received', handleFriendRequestReceived);
      socket.off('friend_request_response', handleFriendRequestResponse);
      socket.off('friend_removed', handleFriendRemoved);
    };
  }, [socket]);
>>>>>>> feature/darkmode-bugfix

    return (
        <FriendContext.Provider value={{
            friends,
            pendingRequests,
            loading,
            sendFriendRequest,
            respondToRequest,
            fetchFriends,
<<<<<<< HEAD
            fetchPendingRequests
=======
            fetchPendingRequests,
            removeFriend
>>>>>>> feature/darkmode-bugfix
        }}>
            {children}
        </FriendContext.Provider>
    );
};

export const useFriend = () => useContext(FriendContext);