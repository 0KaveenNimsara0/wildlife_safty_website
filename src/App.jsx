import React from 'react';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
    return (
        <AuthProvider>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
                <AppRoutes />
            </div>
        </AuthProvider>
    );
}
