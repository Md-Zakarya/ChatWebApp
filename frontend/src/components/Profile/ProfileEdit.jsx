// frontend/src/components/Profile/ProfileEdit.jsx
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileEdit({ onClose, darkMode }) {
    const { user, updateProfile } = useAuth();
    const [username, setUsername] = useState(user?.username || '');
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.avatar || '');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();
  
// frontend/src/components/Profile/ProfileEdit.jsx
const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('File must be an image');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result); // reader.result contains base64 string
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
        toast.error('Username is required');
        return;
    }

    try {
        setLoading(true);
        const userData = {
            username,
            avatar // Now contains base64 string
        };

        await updateProfile(userData);
        toast.success('Profile updated successfully');
        onClose();
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update profile');
        console.error('Failed to update profile:', error);
    } finally {
        setLoading(false);
    }
};
   

    return(
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className={`${
                darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg p-8 max-w-md w-full transition-colors duration-200`}>
                <h2 className={`text-2xl font-bold mb-4 ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <img 
                                    src={preview || '/default-avatar'}
                                    alt="Avatar preview"
                                    className={`w-32 h-32 rounded-full object-cover ring-2 ${
                                        darkMode ? 'ring-gray-600' : 'ring-gray-200'
                                    }`}
                                />
                                <img
                                    src={user.avatar || '/default-avatar.png'}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className={`absolute bottom-0 right-0 ${
                                        darkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } text-white rounded-full p-2 transition-colors duration-200`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <div className="mb-4">
                        <label className={`block text-sm font-bold mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={`w-full p-2 border rounded transition-colors duration-200 ${
                                darkMode 
                                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-indigo-400' 
                                    : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500'
                            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 transition-colors duration-200 ${
                                darkMode 
                                    ? 'text-gray-400 hover:text-gray-200' 
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-white rounded transition-colors duration-200 ${
                                darkMode
                                    ? 'bg-indigo-500 hover:bg-indigo-600'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            } disabled:opacity-50`}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}