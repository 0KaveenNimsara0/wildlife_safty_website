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
    if (config.url.includes('/admin') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (config.url.includes('/medical-officer') && medicalToken) {
      config.headers.Authorization = `Bearer ${medicalToken}`;
    } else if (
      config.url.includes('/posts') || 
      config.url.includes('/articles') || 
      config.url.includes('/notifications') || 
      config.url.includes('/chat')
    ) {
      // Shared endpoints - use whatever token is available (priority: admin -> medical -> user)
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else if (medicalToken) {
        config.headers.Authorization = `Bearer ${medicalToken}`;
      } else if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized Notification API
export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export default api;
