import { sessionToken } from '../config/app.js';
import axios from 'axios';
import { API_CONFIG } from '../config/constants.js';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
 const target = new URL(/^https?:/.test(config.url) ? config.url : API_CONFIG.BASE_URL.replace(/\/$/, '') + '/' + config.url.replace(/^\//, ''));
 const base = new URL(API_CONFIG.BASE_URL);
 if (target.origin !== base.origin || !target.pathname.startsWith(base.pathname.replace(/\/$/, '') + '/')) throw new Error('API client cannot send credentials outside its API');
 const token = sessionToken();
 if (token) config.headers.Authorization = `Bearer ${token}`;
 return config;
});

// Centralized Notification API
export const notificationApi = {
  getNotifications: () => getSharedNotifications(),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

// Medical Officer API
export const medicalOfficerApi = {
  getProfile: () => api.get('/medical-officer/auth/profile'),
  updateProfile: (data) => api.put('/medical-officer/auth/profile', data),
  uploadProfilePicture: (formData) => api.post('/medical-officer/auth/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export default api;

// Coalesce simultaneous notification reads, scoped to the current credential.
const notificationRequests = new Map();
function getSharedNotifications() {
 const key = sessionToken() || '';
 if (!notificationRequests.has(key)) {
  const request = api.get('/notifications').finally(() => notificationRequests.delete(key));
  notificationRequests.set(key, request);
 }
 return notificationRequests.get(key);
}
