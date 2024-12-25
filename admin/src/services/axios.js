import axios from 'axios';

const api = axios.create({
    baseURL: 'https://chatify-0xgi.onrender.com/api',
});

// Add token to every request
api.interceptors.request.use((config) => {
    const admin = JSON.parse(localStorage.getItem('admin'));
    if (admin?.token) {
        config.headers.Authorization = `Bearer ${admin.token}`;
    }
    return config;
});

export default api;