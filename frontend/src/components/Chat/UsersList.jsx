// frontend/src/components/Chat/UsersList.jsx
import { useState } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { useFriend } from '../../context/FriendContext';
import { toast } from 'react-toastify';
import api from '../../services/axios';
import LoadingSpinner from '../LoadingSpinner';
import ProfileEdit from '../Profile/ProfileEdit';
import DarkModeToggle from '../DarkModeToggle';
import { useTheme } from '../../context/ThemeContext';

export default function UsersList() {
    const { onlineUsers, setSelectedUser, selectedUser, unreadCounts, setUnreadCounts } = useChat();
    const { user, logout } = useAuth();
    const { friends, pendingRequests, loading: friendsLoading, sendFriendRequest, respondToRequest, removeFriend } = useFriend();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [requestInProgress, setRequestInProgress] = useState({});
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [friendToRemove, setFriendToRemove] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { darkMode } = useTheme();

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
            // Error handling is managed in context
        } finally {
            setRequestInProgress(prev => ({ ...prev, [userId]: false }));
        }
    };

    const handleRemoveFriend = async () => {
        if (friendToRemove) {
            await removeFriend(friendToRemove._id);
            setShowRemoveModal(false);
            setFriendToRemove(null);
        }
    };

    if (friendsLoading) return <div className="w-80 flex justify-center p-4"><LoadingSpinner /></div>;

    return (
        <div className={`min-h-screen flex flex-col shadow-lg ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
            <div className={`p-4 ${
    darkMode 
        ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200' 
        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
}`}>
    <div className="flex items-center justify-between">
        <div className="flex items-center">
            <div className="relative">
                <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
                <h3 className="font-semibold text-lg">{user.username}</h3>
                <p className="text-xs">Online</p>
            </div>
        </div>
        <DarkModeToggle className={`${
            darkMode ? 'text-gray-200' : 'text-white'
        }`} />
        <div className="relative">
            <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`p-2 rounded-full transition-colors ${
                    darkMode 
                        ? 'hover:bg-gray-700/10' 
                        : 'hover:bg-white/10'
                }`}
            >
                <svg className={`w-5 h-5 ${
                    darkMode ? 'text-gray-200' : 'text-white'
                }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>
            
            {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 animate-fadeIn ${
                    darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-100'
                }`}>
                    <button
                        onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileMenu(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center ${
                            darkMode 
                                ? 'text-gray-200 hover:bg-gray-600' 
                                : 'text-gray-700 hover:bg-gray-50'
                        } rounded-t-lg`}
                    >
                        <svg className={`w-4 h-4 mr-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-500'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </button>
                    <button
                        onClick={logout}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center ${
                            darkMode 
                                ? 'text-red-400 hover:bg-red-600' 
                                : 'text-red-600 hover:bg-red-50'
                        } rounded-b-lg`}
                    >
                        <svg className={`w-4 h-4 mr-2 ${
                            darkMode ? 'text-red-300' : 'text-red-500'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            )}
        </div>
    </div>
</div>


            <div className={`p-4 border ${
    darkMode 
        ? 'bg-gray-800 text-white border-gray-700' 
        : 'bg-white text-gray-900 border-gray-200'
}`}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className={`w-full p-2 pl-10 border rounded-lg transition-all ${
                            darkMode 
                                ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500' 
                                : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-indigo-500`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <svg
                        className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

               {/* Search Results */}
{searching ? (
    <div className="flex justify-center my-6">
        <LoadingSpinner />
    </div>
) : searchResults.length > 0 && (
    <div className="my-4">
        <h3 className={`font-medium text-lg mb-3 ${
            darkMode ? 'text-gray-200' : 'text-gray-900'
        }`}>
            Search Results
        </h3>
        
        <div className="space-y-2.5">
            {searchResults.map(searchUser => (
                <div 
                    key={searchUser._id} 
                    className={`flex items-center justify-between p-3 rounded-lg
                        transition-all duration-200 ${
                        darkMode 
                            ? 'bg-gray-800/50 hover:bg-gray-800' 
                            : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <img 
                            src={searchUser.avatar || '/default-avatar.png'} 
                            alt={searchUser.username}
                            className={`w-8 h-8 rounded-full ${
                                darkMode ? 'border border-gray-700' : 'border border-gray-200'
                            }`}
                        />
                        <span className={`font-medium ${
                            darkMode ? 'text-gray-200' : 'text-gray-700'
                        }`}>
                            {searchUser.username}
                        </span>
                    </div>
                    
                    <button
                        onClick={() => handleFriendRequest(searchUser._id)}
                        disabled={requestInProgress[searchUser._id]}
                        className={`px-4 py-1.5 text-sm rounded-md font-medium
                            transition-all duration-200 ${
                            darkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800'
                                : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300'
                            } disabled:cursor-not-allowed`}
                    >
                        {requestInProgress[searchUser._id] ? (
                            <span className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-t-transparent border-white rounded-full animate-spin" />
                                Sending...
                            </span>
                        ) : (
                            'Add Friend'
                        )}
                    </button>
                </div>
            ))}
        </div>
    </div>
)}
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
                <div className="mb-4 p-4 border-b dark:border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Friend Requests</h3>
                    <div className="space-y-2">
                        {pendingRequests.map(request => (
                            <div key={request.from._id} className="flex items-center justify-between p-2 
                                bg-gray-50 dark:bg-gray-700 rounded
                                transition-colors duration-200">
                                <span className="dark:text-gray-200">{request.from.username}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => respondToRequest(request.from._id, 'accepted')}
                                        className="px-3 py-1 text-sm bg-green-500 text-white rounded 
                                        hover:bg-green-600 dark:hover:bg-green-700
                                        transition-colors duration-200"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => respondToRequest(request.from._id, 'rejected')}
                                        className="px-3 py-1 text-sm bg-red-500 text-white rounded 
                                        hover:bg-red-600 dark:hover:bg-red-700
                                        transition-colors duration-200"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
    <div className={`p-4 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            Friends
        </h3>
        {friends.map(friend => (
            <div
                key={friend._id}
                onClick={() => {
                    setSelectedUser(friend._id);
                    setUnreadCounts(prev => ({ ...prev, [friend._id]: 0 }));
                }}
                className={`w-full p-4 flex items-center space-x-3 cursor-pointer rounded-lg transition-colors duration-200 ${
                    selectedUser === friend._id
                        ? darkMode 
                            ? 'bg-gray-800 border border-gray-700' 
                            : 'bg-indigo-50'
                        : darkMode
                            ? 'hover:bg-gray-800 border border-gray-800' 
                            : 'hover:bg-gray-50'
                }`}
            >
                <div className="relative">
                    <img
                        src={friend.avatar || '/default-avatar.png'}
                        alt={friend.username}
                        className="w-12 h-12 rounded-full border-2 dark:border-gray-700"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                        darkMode ? 'border-gray-800' : 'border-white'
                    } ${onlineUsers[friend._id]?.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
                <div className="flex-1 text-left">
                <div className={`
    font-medium text-base
    truncate max-w-[180px]
    transition-colors duration-200
    ${darkMode 
        ? 'text-gray-100 group-hover:text-indigo-300' 
        : 'text-gray-900 group-hover:text-indigo-600'
    }
`}>
    {friend.username}
</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {onlineUsers[friend._id]?.isOnline ? 'Online' : 'Offline'}
                    </div>
                </div>
                {unreadCounts[friend._id] > 0 && (
                    <span className="bg-indigo-500 dark:bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCounts[friend._id]}
                    </span>
                )}
                <div className="relative">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpen(dropdownOpen === friend._id ? null : friend._id);
                        }}
                        className={`ml-2 px-2 py-1 text-xs rounded transition-colors duration-200 ${
                            darkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        ⋮
                    </button>
                    {dropdownOpen === friend._id && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                            darkMode 
                                ? 'bg-gray-800 border-gray-700' 
                                : 'bg-white border-gray-100'
                        }`}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFriendToRemove(friend);
                                    setShowRemoveModal(true);
                                    setDropdownOpen(null);
                                }}
                                className={`block w-full px-4 py-2 text-left text-sm rounded-lg transition-colors duration-200 ${
                                    darkMode
                                        ? 'text-red-400 hover:bg-red-900/50' 
                                        : 'text-red-600 hover:bg-red-50'
                                }`}
                            >
                                Remove Friend
                            </button>
                        </div>
                    )}
                </div>
            </div>
        ))}
    </div>
</div>

            {/* Profile Edit Modal */}
            {showProfileModal && (
    <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" />
        <div className="relative flex items-center justify-center min-h-screen p-4">
            <ProfileEdit onClose={() => setShowProfileModal(false)} darkMode={darkMode} />
        </div>
    </div>
)}

          {/* Remove Friend Confirmation Modal */}
{showRemoveModal && (
    <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" />
        <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg p-8 max-w-md w-full shadow-xl transition-colors duration-200`}>
                <h3 className={`text-2xl font-bold mb-4 ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                    Remove Friend
                </h3>
                <p className={`mb-6 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                    Are you sure you want to remove{' '}
                    <span className="font-semibold">
                        {friendToRemove?.username}
                    </span>{' '}
                    from your friend list?
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => setShowRemoveModal(false)}
                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                            darkMode 
                                ? 'text-gray-400 hover:text-gray-200' 
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRemoveFriend}
                        className="px-4 py-2 bg-red-500 text-white rounded 
                        hover:bg-red-600 transform transition-all duration-200 
                        hover:scale-[1.02] focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-red-500"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
}