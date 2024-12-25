// filepath: /C:/Users/zakki/OneDrive/Desktop/ChatApp/admin/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
          <Routes>
            <Route path="/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </div>
        <ToastContainer position="bottom-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;