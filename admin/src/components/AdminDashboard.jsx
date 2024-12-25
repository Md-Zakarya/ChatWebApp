import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/axios';
import AdminHeader from './layout/AdminHeader';
import AdminSidebar from './layout/AdminSidebar';
import { HomeIcon, UserGroupIcon, ChartBarIcon, InformationCircleIcon } from '@heroicons/react/outline';

export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { admin } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeChats: 0,
        messagesPerDay: 0,
        trends: {
            messagesTrend: 0
        }
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('admin/stats');
                setStats(data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            <AdminSidebar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onSidebarToggle={setSidebarOpen} />
                
                <main className="p-6 flex-1 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Title & Breadcrumbs */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Welcome back, {admin?.email}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
                            {/* Total Users Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                            <HomeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                                                <InformationCircleIcon className="h-4 w-4 ml-1 text-gray-400" title="Total number of registered users" />
                                            </div>
                                            {loading ? (
                                                <div className="h-8 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                                            ) : (
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                                                    {stats.totalUsers.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Chats Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                                            <UserGroupIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Chats</h3>
                                                <InformationCircleIcon className="h-4 w-4 ml-1 text-gray-400" title="Number of ongoing conversations" />
                                            </div>
                                            {loading ? (
                                                <div className="h-8 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                                            ) : (
                                                <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                                                    {stats.activeChats.toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Per Day Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                                            <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="flex items-center">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages/Day</h3>
                                                <InformationCircleIcon className="h-4 w-4 ml-1 text-gray-400" title="Average messages sent per day" />
                                            </div>
                                            {loading ? (
                                                <div className="h-8 w-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                                            ) : (
                                                <>
                                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                                                        {stats.messagesPerDay.toLocaleString()}
                                                    </p>
                                                    <p className={`text-sm mt-1 ${
                                                        stats.messagesTrend >= 0 
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-red-600 dark:text-red-400'
                                                    }`}>
                                                        {stats.messagesTrend >= 0 ? '↑' : '↓'} {Math.abs(stats.messagesTrend)}% from last week
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity & Analytics Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Activity */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                                {loading ? (
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex space-x-4">
                                                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                                        <p>No recent activity to show.</p>
                                    </div>
                                )}
                            </div>

                            {/* Analytics Preview */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics Overview</h3>
                                {/* Add your analytics visualization component here */}
                                <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                    <p>Analytics visualization coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}