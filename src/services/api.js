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
    
    // Logic to decide which token to use based on target URL or other context
    // For now, if adminToken exists and it's an admin route, use it
    if (config.url.startsWith('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (config.url.startsWith('/medical-officer') && medicalToken) {
      config.headers.Authorization = `Bearer ${medicalToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
