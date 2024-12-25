import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chatify-0xgi.onrender.com/api',
    // Local development URL (uncomment below line and comment above line for local development)
    // baseURL: 'http://localhost:5000/api',
});

// Add token to every request
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
