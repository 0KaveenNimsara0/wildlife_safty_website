import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import MedicalOfficerLayout from '../layouts/MedicalLayout';
import AuthLayout from '../layouts/AuthLayout';

// Public User Pages
import Dashboard from '../pages/user/Dashboard';
import Identifier from '../pages/user/Identifier';
import Emergency from '../pages/user/Emergency';
import Learn from '../pages/user/Learn';
import Map from '../pages/user/Map';
import AnimalDetails from '../pages/user/AnimalDetails';
import CommunityFeed from '../pages/user/CommunityFeed';
import ArticleSelection from '../pages/user/ArticleSelection';
import UserPosts from '../pages/user/UserPosts';
import Chat from '../pages/user/Chat';
import NotificationsPage from '../pages/NotificationsPage';
import ContactPage from '../pages/user/ContactPage';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminLogin from '../pages/admin/AdminLoginPage'; 
import AdminRegister from '../pages/admin/AdminRegisterPage';
import MedicalLogin from '../pages/medical/MedicalOfficerLoginPage';
import MedicalRegister from '../pages/medical/MedicalOfficerRegisterPage';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Admin Sections
import AdminOverviewSection from '../features/admin/components/AdminOverviewSection';
import UserManagementSection from '../features/admin/components/UserManagementSection';
import MedicalOfficerManagementSection from '../features/admin/components/MedicalOfficerManagementSection';
import AdminMedicalChatSection from '../features/admin/components/AdminMedicalChatSection';
import AdminArticleSection from '../features/admin/components/AdminArticleSection';
import AdminProfileSection from '../features/admin/components/AdminProfileSection';
import AdminPredictionOversight from '../features/admin/components/AdminPredictionOversight';
import GlobalAuditOversight from '../features/admin/components/GlobalAuditOversight';
import AdminContactSection from '../features/admin/components/AdminContactSection';

// Medical Officer Sections
import MedicalOverviewSection from '../features/medical/components/MedicalOverviewSection';
import ConsultationsSection from '../features/medical/components/ConsultationsSection';
import MedicalArticleSection from '../features/medical/components/MedicalArticleSection';
import MedicalProfileSection from '../features/medical/components/MedicalProfileSection';
import MedicalArticleCreate from '../features/medical/components/MedicalOfficerArticleCreatePage';
import MedicalArticleEdit from '../features/medical/components/MedicalOfficerArticleEditPage';
import MedicalPredictionOversight from '../features/medical/components/MedicalPredictionOversight';
import MedicalActivitySection from '../features/medical/components/MedicalActivitySection';
import MedicalOfficerArticleViewPage from '../features/medical/components/MedicalOfficerArticleViewPage';
import UserArticleViewPage from '../features/user/components/UserArticleViewPage';

import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public & General User Site - Wrapped in UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Identifier />} />
        <Route path="/home" element={<Identifier />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/learning" element={<Learn />} />
        <Route path="/map" element={<Map />} />
        <Route path="/animalDetail" element={<AnimalDetails />} />
        <Route path="/communityFeed" element={<CommunityFeed />} />
        <Route path="/article-selection" element={<ArticleSelection />} />
        <Route path="/my-posts" element={<UserPosts />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      
      {/* Protected User Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
           <Route path="articles/:articleId" element={<UserArticleViewPage />} />
        </Route>
      </Route>

      {/* Authentication Layer */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword mode="user" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword mode="admin" />} />
        <Route path="/medical-officer/login" element={<MedicalLogin />} />
        <Route path="/medical-officer/register" element={<MedicalRegister />} />
        <Route path="/medical-officer/forgot-password" element={<ForgotPassword mode="medicalOfficer" />} />
      </Route>

      {/* Admin Portal Layer - Wrapped in AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewSection />} />
        <Route path="dashboard" element={<AdminOverviewSection />} />
        <Route path="users" element={<UserManagementSection />} />
        <Route path="medical-officers" element={<MedicalOfficerManagementSection />} />
        <Route path="predictions" element={<AdminPredictionOversight />} />
        <Route path="audit-logs" element={<GlobalAuditOversight />} />
        <Route path="chat/officer/:officerId" element={<AdminMedicalChatSection />} />
        <Route path="articles" element={<AdminArticleSection />} />
        <Route path="profile" element={<AdminProfileSection />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="contact-tickets" element={<AdminContactSection />} />
      </Route>

      {/* Medical Officer Portal Layer - Wrapped in MedicalOfficerLayout */}
      <Route path="/medical-officer" element={<MedicalOfficerLayout />}>
        <Route index element={<MedicalOverviewSection />} />
        <Route path="dashboard" element={<MedicalOverviewSection />} />
        <Route path="predictions" element={<MedicalPredictionOversight />} />
        <Route path="chat" element={<ConsultationsSection />} />
        <Route path="profile" element={<MedicalProfileSection />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="articles" element={<MedicalArticleSection />} />
        <Route path="activity-log" element={<MedicalActivitySection />} />
        <Route path="articles/:articleId" element={<MedicalOfficerArticleViewPage />} />
        <Route path="articles/create" element={<MedicalArticleCreate />} />
        <Route path="articles/edit/:articleId" element={<MedicalArticleEdit />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
