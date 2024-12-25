import { HomeIcon, UserGroupIcon, ChartBarIcon, ChatAlt2Icon, CogIcon, LogoutIcon } from '@heroicons/react/outline';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminSidebar({ sidebarOpen, onClose }) {
    const { logout } = useAuth();
    
    const navItems = [
        { name: 'Dashboard', icon: HomeIcon, href: '/admin/dashboard', active: true },
        { name: 'Users', icon: UserGroupIcon, href: '/admin/users' },
        { name: 'Analytics', icon: ChartBarIcon, href: '/admin/analytics' },
        { name: 'Messages', icon: ChatAlt2Icon, href: '/admin/messages' },
        { name: 'Settings', icon: CogIcon, href: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <aside
            className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                fixed inset-y-0 left-0 z-50 w-64 
                bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                transform transition-transform duration-300 ease-in-out
                md:translate-x-0 md:static
            `}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-purple-600 to-blue-500">
                    <h2 className="text-white text-xl font-semibold">Admin Panel</h2>
                </div>
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map((item) => (
                        <Link 
                            key={item.name}
                            to={item.href}
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors duration-200"
                    >
                        <LogoutIcon className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </div>
        </aside>
    );
}