// services/api.service.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les réponses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const role = localStorage.getItem('role') || localStorage.getItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      const isVendorPath = window.location.pathname.startsWith('/vendor');
      if (role === 'vendor' || isVendorPath) {
        window.location.href = '/auth/login-vendor';
      } else {
        window.location.href = '/auth/login-client';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
