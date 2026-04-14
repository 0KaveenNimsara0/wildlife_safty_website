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
import ArticleSelectionPage from './assets/pages/ArticleSelectionPage';
import LoginPage from './assets/pages/auth/LoginPage';
import RegisterPage from './assets/pages/auth/RegisterPage';
import ResetPasswordPage from './assets/pages/auth/ResetPasswordPage';
import Dashboard from './assets/pages/Dashboard';
import PrivateRoute from './assets/components/PrivateRoute';
import UserPostsPage from './assets/pages/UserPostsPage';
import UserChatPage from './assets/pages/UserChatPage';

// Admin pages & Components
import AdminLoginPage from './assets/pages/admin/AdminLoginPage';
import AdminRegisterPage from './assets/pages/admin/AdminRegisterPage';
import AdminDashboard from './assets/pages/admin/AdminDashboard';
import AdminProfilePage from './assets/pages/admin/AdminProfilePage';
import UserManagement from './assets/pages/admin/UserManagement';
import MedicalOfficerManagement from './assets/pages/admin/MedicalOfficerManagement';
import AdminChatManagement from './assets/pages/admin/AdminChatManagement';
import AdminMedicalChat from './assets/pages/admin/AdminMedicalChat';
import AdminArticleManagement from './assets/pages/admin/AdminArticleManagement';
import AdminLayout from './assets/components/admin/AdminLayout';

// Medical Officer pages
import MedicalOfficerLoginPage from './assets/pages/medicalOfficer/MedicalOfficerLoginPage';
import MedicalOfficerRegisterPage from './assets/pages/medicalOfficer/MedicalOfficerRegisterPage';
import MedicalOfficerDashboard from './assets/pages/medicalOfficer/MedicalOfficerDashboard';
import MedicalOfficerChatPage from './assets/pages/medicalOfficer/MedicalOfficerChatPage';
import MedicalOfficerArticleCreatePage from './assets/pages/medicalOfficer/MedicalOfficerArticleCreatePage';
import MedicalOfficerArticleEditPage from './assets/pages/medicalOfficer/MedicalOfficerArticleEditPage';

// Components
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';

export default function App() {
    const [page, setPage] = useState('home'); 
    const [authPage, setAuthPage] = useState(null);

    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen selection:bg-emerald-200 selection:text-emerald-900">
                {authPage ? (
                    <div className="flex items-center justify-center min-h-screen p-4 bg-slate-50">
                        <div className="w-full max-w-md animate-fade-in">
                            {authPage === 'login' && <LoginPage setPage={setAuthPage} />}
                            {authPage === 'register' && <RegisterPage setPage={setAuthPage} />}
                            {authPage === 'resetPassword' && <ResetPasswordPage setPage={setAuthPage} />}
                        </div>
                    </div>
                ) : window.location.pathname.startsWith('/admin') && !['/admin/login', '/admin/register'].includes(window.location.pathname) ? (
                    <AdminLayout>
                        <Routes>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/profile" element={<AdminProfilePage />} />
                            <Route path="/admin/users" element={<UserManagement />} />
                            <Route path="/admin/medical-officers" element={<MedicalOfficerManagement />} />
                            <Route path="/admin/chat" element={<AdminChatManagement />} />
                            <Route path="/admin/chat/officer/:officerId" element={<AdminMedicalChat />} />
                            <Route path="/admin/articles" element={<AdminArticleManagement />} />
                        </Routes>
                    </AdminLayout>
                ) : (
                    <>
                        {!window.location.pathname.startsWith('/admin') && <Header page={page} setPage={setPage} setAuthPage={setAuthPage} />}
                        
                        {/* Main Interaction Area */}
                        <main className="flex-grow pt-24 pb-16">
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <Routes>
                                    <Route path="/" element={<IdentifierPage />} />
                                    <Route path="/home" element={<IdentifierPage />} />
                                    <Route path="/emergency" element={<EmergencyPage />} />
                                    <Route path="/learning" element={<LearnPage />} />
                                    <Route path="/map" element={<MapPage />} />
                                    <Route path="/animalDetail" element={<AnimalDetailPage />} />
                                    <Route path="/communityFeed" element={<CommunityFeedPage />} />
                                    <Route path="/article-selection" element={<ArticleSelectionPage />} />
                                    <Route path="/my-posts" element={<UserPostsPage />} />
                                    <Route path="/chat" element={<UserChatPage />} />

                                    {/* Admin routes */}
                                    <Route path="/admin/login" element={<AdminLoginPage />} />
                                    <Route path="/admin/register" element={<AdminRegisterPage />} />
                                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                    <Route path="/admin/profile" element={<AdminProfilePage />} />
                                    <Route path="/admin/users" element={<UserManagement />} />
                                    <Route path="/admin/medical-officers" element={<MedicalOfficerManagement />} />
                                    <Route path="/admin/chat" element={<AdminChatManagement />} />
                                    <Route path="/admin/chat/officer/:officerId" element={<AdminMedicalChat />} />
                                    <Route path="/admin/articles" element={<AdminArticleManagement />} />

                                    {/* Medical Officer routes */}
                                    <Route path="/medical-officer/login" element={<MedicalOfficerLoginPage />} />
                                    <Route path="/medical-officer/register" element={<MedicalOfficerRegisterPage />} />
                                    <Route path="/medical-officer/dashboard" element={<MedicalOfficerDashboard />} />
                                    <Route path="/medical-officer/chat" element={<MedicalOfficerChatPage />} />
                                    <Route path="/medical-officer/articles/create" element={<MedicalOfficerArticleCreatePage />} />
                                    <Route path="/medical-officer/articles/edit/:articleId" element={<MedicalOfficerArticleEditPage />} />

                                    <Route element={<PrivateRoute />}>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/animalDetail" element={<AnimalDetailPage />} />
                                    </Route>
                                </Routes>
                            </div>
                        </main>

                        {!window.location.pathname.startsWith('/admin') && <Footer setPage={setPage} />}
                    </>
                )}
            </div>
        </AuthProvider>
    );
}
