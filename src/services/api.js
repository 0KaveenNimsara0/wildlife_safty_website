import axios from 'axios';
import { API_CONFIG } from '../config/constants';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for tokens
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken');
    const medicalToken = localStorage.getItem('medicalOfficerToken');
    const userToken = localStorage.getItem('userToken');
    
    // Logic to decide which token to use based on target URL or other context
    if (config.url.startsWith('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (config.url.startsWith('/medical-officer') && medicalToken) {
      config.headers.Authorization = `Bearer ${medicalToken}`;
    } else if (userToken) {
      // Default to user token for other routes (like /user/chat)
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
