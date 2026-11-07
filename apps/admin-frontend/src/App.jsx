import React from 'react';
import { AdminAuthProvider } from './context/AdminAuthProvider.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import NotificationToasts from '../../../packages/shared/src/components/notifications/NotificationToasts.jsx';
export default function App() { return <AdminAuthProvider><NotificationToasts/><AppRoutes/></AdminAuthProvider>; }
