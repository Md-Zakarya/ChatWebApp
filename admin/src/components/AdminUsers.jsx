import React, { useState, useEffect } from 'react';
import AdminHeader from './layout/AdminHeader';
import AdminSidebar from './layout/AdminSidebar';
import { SearchIcon, TrashIcon, UserIcon } from '@heroicons/react/outline';
import api from '../services/axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminUsers() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const deleteUser = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
            toast.success('User deleted successfully');
            setShowDeleteModal(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error deleting user');
        }
    };

    const updateUserRole = async (id, newRole) => {
        try {
            const response = await api.put(`/admin/users/${id}/role`, { role: newRole });
            setUsers(prevUsers => prevUsers.map(user => user._id === id ? response.data : user));
            toast.success(`User role updated to ${newRole}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error updating user role');
        }
    };

    const filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <AdminSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onSidebarToggle={setSidebarOpen} />
                
                <main className="p-6 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Manage user accounts and permissions
                                </p>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                                <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            ) : error ? (
                                <div className="p-4 text-red-500 text-center">{error}</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {filteredUsers.map(user => (
                                                <tr 
                                                    key={user._id}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                                                            <span className="text-gray-700 dark:text-gray-200">{user.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-200">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                            user.role === 'admin' 
                                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                                        }`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap space-x-3">
                                                        <button 
                                                            onClick={() => handleDeleteClick(user)}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 transition-colors"
                                                        >
                                                            <TrashIcon className="h-4 w-4 mr-1.5" />
                                                            Delete
                                                        </button>
                                                        <button 
                                                            onClick={() => updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
                                                        >
                                                            {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Are you sure you want to delete {userToDelete?.username}? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteUser(userToDelete._id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <div>
                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
}