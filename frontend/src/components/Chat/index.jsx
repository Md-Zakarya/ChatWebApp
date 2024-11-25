// frontend/src/components/Chat/index.jsx
import { useEffect } from 'react';
import UsersList from './UsersList';
import ChatWindow from './ChatWindow';
import { useChat } from '../../context/ChatContext';
import LoadingSpinner from '../LoadingSpinner';

export default function Chat() {
    const { selectedUser, loading } = useChat();

    if (loading) {
        return <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner />
        </div>;
    }

    return (
        <div className="flex h-[calc(100vh-64px)]">
            <UsersList />
            {selectedUser ? (
                <ChatWindow />
            ) : (
                <div className="flex-1 flex items-center justify-center bg-white">
                    <p className="text-gray-500">Select a user to start chatting</p>
                </div>
            )}
        </div>
    );
}