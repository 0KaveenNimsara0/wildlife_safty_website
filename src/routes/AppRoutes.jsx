import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import MedicalOfficerLayout from '../layouts/MedicalLayout';
const Landing = lazy(() => import('../pages/user/Landing'));

// Public User Pages
const Dashboard = lazy(() => import('../pages/user/Dashboard'));
const Identifier = lazy(() => import('../pages/user/Identifier'));
const Emergency = lazy(() => import('../pages/user/Emergency'));
const Learn = lazy(() => import('../pages/user/Learn'));
const Map = lazy(() => import('../pages/user/Map'));
const AnimalDetails = lazy(() => import('../pages/user/AnimalDetails'));
const CommunityFeed = lazy(() => import('../pages/user/CommunityFeed'));
const UserPosts = lazy(() => import('../pages/user/UserPosts'));
const Chat = lazy(() => import('../pages/user/Chat'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const ContactPage = lazy(() => import('../pages/user/ContactPage'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLoginPage'));
const AdminRegister = lazy(() => import('../pages/admin/AdminRegisterPage'));
const MedicalLogin = lazy(() => import('../pages/medical/MedicalOfficerLoginPage'));
const MedicalRegister = lazy(() => import('../pages/medical/MedicalOfficerRegisterPage'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));

// Admin Sections
const AdminOverviewSection = lazy(() => import('../features/admin/components/AdminOverviewSection'));
const UserManagementSection = lazy(() => import('../features/admin/components/UserManagementSection'));
const MedicalOfficerManagementSection = lazy(() => import('../features/admin/components/MedicalOfficerManagementSection'));
const AdminMedicalChatSection = lazy(() => import('../features/admin/components/AdminMedicalChatSection'));
const AdminArticleSection = lazy(() => import('../features/admin/components/AdminArticleSection'));
const AdminProfileSection = lazy(() => import('../features/admin/components/AdminProfileSection'));
const AdminPredictionOversight = lazy(() => import('../features/admin/components/AdminPredictionOversight'));
const GlobalAuditOversight = lazy(() => import('../features/admin/components/GlobalAuditOversight'));
const AdminContactSection = lazy(() => import('../features/admin/components/AdminContactSection'));

// Medical Officer Sections
const MedicalOverviewSection = lazy(() => import('../features/medical/components/MedicalOverviewSection'));
const ConsultationsSection = lazy(() => import('../features/medical/components/ConsultationsSection'));
const MedicalArticleSection = lazy(() => import('../features/medical/components/MedicalArticleSection'));
const MedicalProfileSection = lazy(() => import('../features/medical/components/MedicalProfileSection'));
const MedicalArticleCreate = lazy(() => import('../features/medical/components/MedicalOfficerArticleCreatePage'));
const MedicalArticleEdit = lazy(() => import('../features/medical/components/MedicalOfficerArticleEditPage'));
const MedicalPredictionOversight = lazy(() => import('../features/medical/components/MedicalPredictionOversight'));
const MedicalActivitySection = lazy(() => import('../features/medical/components/MedicalActivitySection'));
const MedicalOfficerArticleViewPage = lazy(() => import('../features/medical/components/MedicalOfficerArticleViewPage'));
const UserArticleViewPage = lazy(() => import('../features/user/components/UserArticleViewPage'));

import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Suspense fallback={<div role="status" className="p-8 text-center text-emerald-900">Loading page…</div>}>
    <Routes>
      {/* Public & General User Site - Wrapped in UserLayout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/identify" element={<Identifier />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/learning" element={<Learn />} />
        <Route path="/map" element={<Map />} />
        <Route path="/animalDetail" element={<AnimalDetails />} />
        <Route path="/communityFeed" element={<CommunityFeed />} />
        <Route path="/article-selection" element={<Navigate to="/learning" replace />} />
        <Route path="/my-posts" element={<UserPosts />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      
      {/* Protected User Dashboard */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
           <Route path=":section" element={null} />
           <Route path="articles/:articleId" element={<UserArticleViewPage />} />
        </Route>
      </Route>

      {/* Authentication Layer */}
      <Route>
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
      <Route element={<ProtectedRoute role="admin" />}>
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

      </Route>

      {/* Medical Officer Portal Layer - Wrapped in MedicalOfficerLayout */}
      <Route element={<ProtectedRoute role="medical" />}>
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

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}
