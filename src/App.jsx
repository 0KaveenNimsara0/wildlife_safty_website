import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './assets/components/AuthContext';
import { Routes, Route } from 'react-router-dom';

// Page components
import IdentifierPage from './assets/pages/IdentifierPage';
import EmergencyPage from './assets/pages/EmergencyPage';
import LearnPage from './assets/pages/LearnPage';
import MapPage from './assets/pages/MapPage';
import AnimalDetailPage from './assets/pages/AnimalDetailPage';
import CommunityFeedPage from './assets/pages/CommunityFeedPage';
import LoginPage from './assets/pages/auth/LoginPage';
import RegisterPage from './assets/pages/auth/RegisterPage';
import ResetPasswordPage from './assets/pages/auth/ResetPasswordPage';
import Dashboard from './assets/pages/Dashboard';
import PrivateRoute from './assets/components/PrivateRoute';
import UserPostsPage from './assets/pages/UserPostsPage';

// Components
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';

export default function App() {
    const [page, setPage] = useState('home'); 
    const [authPage, setAuthPage] = useState(null);

    return (
        <AuthProvider>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans text-gray-800">
                {authPage ? (
                    <div className="flex items-center justify-center min-h-screen p-4">
                        {authPage === 'login' && <LoginPage setPage={setAuthPage} />}
                        {authPage === 'register' && <RegisterPage setPage={setAuthPage} />}
                        {authPage === 'resetPassword' && <ResetPasswordPage setPage={setAuthPage} />}
                    </div>
                ) : (
                    <>
                        <Header page={page} setPage={setPage} setAuthPage={setAuthPage} />
                        <main className="container mx-auto px-6 py-12">
                            <Routes>
                                <Route path="/" element={<IdentifierPage />} />
                                <Route path="/home" element={<IdentifierPage />} />
                                <Route path="/emergency" element={<EmergencyPage />} />
                                <Route path="/learning" element={<LearnPage />} />
                                <Route path="/map" element={<MapPage />} />
                                <Route path="/animalDetail" element={<AnimalDetailPage />} />
                                <Route path="/communityFeed" element={<CommunityFeedPage />} />
                                <Route path="/my-posts" element={<UserPostsPage />} />


                                <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/animalDetail" element={<AnimalDetailPage />} />
                                {/* Add other protected routes here */}
                            </Route>
                            </Routes>
                        </main>
                        <Footer setPage={setPage} />
                    </>
                )}
            </div>
        </AuthProvider>
    );
}