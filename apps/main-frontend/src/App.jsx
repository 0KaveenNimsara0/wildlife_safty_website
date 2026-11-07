import React from 'react';
import NotificationToasts from '../../../packages/shared/src/components/notifications/NotificationToasts.jsx';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import ScrollToTop from '../../../packages/shared/src/components/ScrollToTop.jsx';

export default function App() {
    return (
        <AuthProvider>
            <ScrollToTop />
            <NotificationToasts />
            <div className="flex flex-col min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
                <AppRoutes />
            </div>
        </AuthProvider>
    );
}
