import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../../../../packages/shared/src/routes/ProtectedRoute.jsx';
import ForgotPassword from '../../../../packages/shared/src/pages/auth/ForgotPassword.jsx';
import NotificationsPage from '../../../../packages/shared/src/pages/NotificationsPage.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
const AdminLogin = lazy(() => import('../pages/admin/AdminLoginPage.jsx'));
const AdminRegister = lazy(() => import('../pages/admin/AdminRegisterPage.jsx'));
const AdminOverviewSection = lazy(() => import('../features/admin/components/AdminOverviewSection.jsx'));
const UserManagementSection = lazy(() => import('../features/admin/components/UserManagementSection.jsx'));
const MedicalOfficerManagementSection = lazy(() => import('../features/admin/components/MedicalOfficerManagementSection.jsx'));
const AdminMedicalChatSection = lazy(() => import('../features/admin/components/AdminMedicalChatSection.jsx'));
const AdminArticleSection = lazy(() => import('../features/admin/components/AdminArticleSection.jsx'));
const AdminProfileSection = lazy(() => import('../features/admin/components/AdminProfileSection.jsx'));
const AdminPredictionOversight = lazy(() => import('../features/admin/components/AdminPredictionOversight.jsx'));
const GlobalAuditOversight = lazy(() => import('../features/admin/components/GlobalAuditOversight.jsx'));
const AdminContactSection = lazy(() => import('../features/admin/components/AdminContactSection.jsx'));
export default function AppRoutes() { return <Suspense fallback={<p role="status">Loading admin workspace…</p>}><Routes>
<Route path="/admin/login" element={<AdminLogin />} />
<Route path="/admin/register" element={<AdminRegister />} />
<Route path="/admin/forgot-password" element={<ForgotPassword mode="admin" />} />
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

<Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
</Routes></Suspense>; }
