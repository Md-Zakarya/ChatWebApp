import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/axios';
import AdminHeader from './layout/AdminHeader';
import AdminSidebar from './layout/AdminSidebar';
import { HomeIcon, UserGroupIcon, ChartBarIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);


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
    const [analyticsData, setAnalyticsData] = useState({
        userGrowth: [],
        messagePatterns: [],
        engagement: {},
        chatDuration: {},
        platformUsage: {}
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

                         {/* Analytics Preview */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analytics Overview</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Growth Trend */}
        <div className="h-64">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">User Growth</h4>
            <Line
                data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'New Users',
                        data: [65, 78, 90, 105, 125, 140],
                        borderColor: '#3B82F6',
                        tension: 0.2
                    }]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false
                }}
            />
        </div>

        {/* Message Activity */}
        <div className="h-64">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Message Activity</h4>
            <Bar
                data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Messages Sent',
                        data: [1200, 1900, 1700, 1600, 2100, 1000, 800],
                        backgroundColor: '#10B981'
                    }]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false
                }}
            />
        </div>

        {/* Platform Usage */}
        <div className="h-64">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Platform Usage</h4>
            <Doughnut
                data={{
                    labels: ['Mobile', 'Desktop', 'Tablet'],
                    datasets: [{
                        data: [60, 30, 10],
                        backgroundColor: ['#EF4444', '#3B82F6', '#F59E0B']
                    }]
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false
                }}
            />
        </div>

        {/* Engagement Metrics */}
        <div className="h-64 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300">Avg. Chat Duration</h5>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">12.5 min</p>
                <p className="text-sm text-green-600 dark:text-green-400">↑ 8% from last week</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-300">Response Rate</h5>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">94%</p>
                <p className="text-sm text-green-600 dark:text-green-400">↑ 2% from last week</p>
            </div>
        </div>
    </div>
</div>
                    </div>
                </main>
            </div>
        </div>
    );
}