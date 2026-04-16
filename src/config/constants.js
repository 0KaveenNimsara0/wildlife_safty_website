export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const ML_URL = import.meta.env.VITE_ML_URL || 'http://127.0.0.1:5000';
export const IMAGE_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace('/api', '');

export const API_CONFIG = {
  BASE_URL,
  ML_URL,
};

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  MEDICAL: 'MEDICAL',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  IDENTIFIER: '/identifier',
  EMERGENCY: '/emergency',
  LEARN: '/learning',
  MAP: '/map',
  COMMUNITY: '/community',
  CHAT: '/chat',
};
