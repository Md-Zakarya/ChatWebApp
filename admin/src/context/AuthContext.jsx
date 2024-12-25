// admin/src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import api from '../services/axios';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });


  const login = async (email, password) => {
    try {
      const response = await api.post('/admin/login', {
        email,
        password,
      });
      const data = response.data;
      setAdmin(data);
      localStorage.setItem('admin', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };





  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);