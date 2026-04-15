import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route, useLocation } from 'react-router-dom';

// Page components
import IdentifierPage from './pages/IdentifierPage';
import EmergencyPage from './pages/EmergencyPage';
import LearnPage from './pages/LearnPage';
import MapPage from './pages/MapPage';
import AnimalDetailPage from './pages/AnimalDetailPage';
import CommunityFeedPage from './pages/CommunityFeedPage';
import ArticleSelectionPage from './pages/ArticleSelectionPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import UserPostsPage from './pages/UserPostsPage';
import UserChatPage from './pages/UserChatPage';

// Admin pages & Components
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminRegisterPage from './pages/admin/AdminRegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import UserManagement from './pages/admin/UserManagement';
import MedicalOfficerManagement from './pages/admin/MedicalOfficerManagement';
import AdminChatManagement from './pages/admin/AdminChatManagement';
import AdminMedicalChat from './pages/admin/AdminMedicalChat';
import AdminArticleManagement from './pages/admin/AdminArticleManagement';
import AdminLayout from './components/admin/AdminLayout';

// Medical Officer pages
import MedicalOfficerLoginPage from './pages/medicalOfficer/MedicalOfficerLoginPage';
import MedicalOfficerRegisterPage from './pages/medicalOfficer/MedicalOfficerRegisterPage';
import MedicalOfficerDashboard from './pages/medicalOfficer/MedicalOfficerDashboard';
import MedicalOfficerChatPage from './pages/medicalOfficer/MedicalOfficerChatPage';
import MedicalOfficerArticleCreatePage from './pages/medicalOfficer/MedicalOfficerArticleCreatePage';
import MedicalOfficerArticleEditPage from './pages/medicalOfficer/MedicalOfficerArticleEditPage';

// Components
import Header from './components/Header';
import Footer from './components/Footer';


export default function App() {
    const [page, setPage] = useState('home'); 
    const [authPage, setAuthPage] = useState(null);
    const location = useLocation();

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
                ) : location.pathname.startsWith('/admin') && !['/admin/login', '/admin/register'].includes(location.pathname) ? (
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
                        {!location.pathname.startsWith('/admin') && <Header page={page} setPage={setPage} setAuthPage={setAuthPage} />}
                        
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

                        {!location.pathname.startsWith('/admin') && <Footer setPage={setPage} />}
                    </>
                )}
            </div>
        </AuthProvider>
    );
}

