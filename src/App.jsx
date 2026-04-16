import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import MedicalLayout from './layouts/MedicalLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages that might be outside general layouts (like root login)
import LoginPage from './pages/auth/Login';
import RegisterPage from './pages/auth/Register';

export default function App() {
    const [page, setPage] = useState('home'); 
    const [authPage, setAuthPage] = useState(null);
    const location = useLocation();

    // Determine which layout to use
    const isAuthRoute = ['/login', '/register', '/admin/login', '/admin/register', '/medical-officer/login', '/medical-officer/register'].includes(location.pathname) || authPage;
    const isAdminRoute = location.pathname.startsWith('/admin') && !isAuthRoute;
    const isMedicalRoute = location.pathname.startsWith('/medical-officer') && !isAuthRoute;

    const renderContent = () => {
        if (authPage) {
            return (
                <AuthLayout>
                    {authPage === 'login' && <LoginPage setPage={setAuthPage} />}
                    {authPage === 'register' && <RegisterPage setPage={setAuthPage} />}
                </AuthLayout>
            );
        }

        if (isAuthRoute) {
            return (
                <AuthLayout>
                    <AppRoutes />
                </AuthLayout>
            );
        }

        if (isAdminRoute) {
            return (
                <AdminLayout>
                    <AppRoutes />
                </AdminLayout>
            );
        }

        if (isMedicalRoute) {
            return (
                <MedicalLayout>
                    <AppRoutes />
                </MedicalLayout>
            );
        }

        return (
            <UserLayout page={page} setPage={setPage} setAuthPage={setAuthPage}>
                <AppRoutes />
            </UserLayout>
        );
    };

    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
                {renderContent()}
            </div>
        </AuthProvider>
    );
}
