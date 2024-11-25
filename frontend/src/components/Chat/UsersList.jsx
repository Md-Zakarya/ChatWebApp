// frontend/src/components/Chat/UsersList.jsx
import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useFriend } from '../../context/FriendContext';
import { toast } from 'react-toastify';
import api from '../../services/axios';
import LoadingSpinner from '../LoadingSpinner';

export default function UsersList() {
    const { onlineUsers, setSelectedUser, selectedUser, unreadCounts, setUnreadCounts } = useChat();
    const { user } = useAuth();
    const { friends, pendingRequests, loading: friendsLoading, sendFriendRequest, respondToRequest } = useFriend();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [requestInProgress, setRequestInProgress] = useState({});

    const handleSearch = async () => {
        if (!searchTerm) return;
        
        try {
            setSearching(true);
            const { data } = await api.get(`/users/search`, {
                params: { search: searchTerm }
            });
            setSearchResults(data);
        } catch (error) {
            console.error('Error searching users:', error);
            toast.error('Failed to search users');
        } finally {
            setSearching(false);
        }
    };

    const handleFriendRequest = async (userId) => {
        try {
            setRequestInProgress(prev => ({ ...prev, [userId]: true }));
            await sendFriendRequest(userId);
            setSearchResults(prev => prev.filter(user => user._id !== userId));
        } catch (error) {
            
            // No additional error handling needed here
        } finally {
            setRequestInProgress(prev => ({ ...prev, [userId]: false }));
        }
    };

    if (friendsLoading) return <div className="w-80 flex justify-center p-4"><LoadingSpinner /></div>;

    return (
        <div className="w-80 flex flex-col border-r bg-white">
            <div className="p-4 border-b">
                <div className="flex mb-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-indigo-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searching || !searchTerm}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 disabled:opacity-50"
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                </div>

                {/* Search Results */}
                {searching ? (
                    <div className="flex justify-center">
                        <LoadingSpinner />
                    </div>
                ) : searchResults.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Search Results</h3>
                        <div className="space-y-2">
                            {searchResults.map(searchUser => (
                                <div key={searchUser._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span>{searchUser.username}</span>
                                    <button
                                        onClick={() => handleFriendRequest(searchUser._id)}
                                        disabled={requestInProgress[searchUser._id]}
                                        className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50"
                                    >
                                        {requestInProgress[searchUser._id] ? 'Sending...' : 'Add Friend'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 mb-2">Friend Requests</h3>
                        <div className="space-y-2">
                            {pendingRequests.map(request => (
                                <div key={request.from._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <span>{request.from.username}</span>
                                    <div className="space-x-2">
                                        <button
                                            onClick={() => respondToRequest(request.from._id, 'accepted')}
                                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => respondToRequest(request.from._id, 'rejected')}
                                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">Friends</h3>
                    {friends.map(friend => (
                        <button
                        key={friend._id}
                        onClick={() => {
                            setSelectedUser(friend._id);
                            setUnreadCounts(prev => ({ ...prev, [friend._id]: 0 }));  // Reset count immediately
                        }}
                        className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 ${
                            selectedUser === friend._id ? 'bg-indigo-50' : ''
                        }`}
                    >
                            <div className="relative">
                                <img
                                    src={friend.avatar || '/default-avatar.png'}
                                    alt={friend.username}
                                    className="w-12 h-12 rounded-full"
                                />
                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    onlineUsers[friend._id]?.isOnline ? 'bg-green-500' : 'bg-gray-500'
                                }`} />
                            </div>
                            <div className="flex-1 text-left">
                                <div className="font-medium">{friend.username}</div>
                                <div className="text-sm text-gray-500">
                                    {onlineUsers[friend._id]?.isOnline ? 'Online' : 'Offline'}
                                </div>
                            </div>
                            {unreadCounts[friend._id] > 0 && (
                                <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded-full">
                                    {unreadCounts[friend._id]}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}