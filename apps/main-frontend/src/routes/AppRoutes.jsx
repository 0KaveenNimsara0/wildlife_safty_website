import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

// Layouts
import UserLayout from '../layouts/UserLayout.jsx';
import MedicalOfficerLayout from '../layouts/MedicalLayout.jsx';
const Landing = lazy(() => import('../pages/user/Landing.jsx'));

// Public User Pages
const Dashboard = lazy(() => import('../pages/user/Dashboard.jsx'));
const Identifier = lazy(() => import('../pages/user/Identifier.jsx'));
const Emergency = lazy(() => import('../pages/user/Emergency.jsx'));
const Learn = lazy(() => import('../pages/user/Learn.jsx'));
const Map = lazy(() => import('../pages/user/Map.jsx'));
const AnimalDetails = lazy(() => import('../pages/user/AnimalDetails.jsx'));
const CommunityFeed = lazy(() => import('../pages/user/CommunityFeed.jsx'));
const UserPosts = lazy(() => import('../pages/user/UserPosts.jsx'));
const Chat = lazy(() => import('../pages/user/Chat.jsx'));
const NotificationsPage = lazy(() => import('../../../../packages/shared/src/pages/NotificationsPage.jsx'));
const ContactPage = lazy(() => import('../pages/user/ContactPage.jsx'));

// Auth Pages
const Login = lazy(() => import('../pages/auth/Login.jsx'));
const Register = lazy(() => import('../pages/auth/Register.jsx'));
const MedicalLogin = lazy(() => import('../pages/medical/MedicalOfficerLoginPage.jsx'));
const MedicalRegister = lazy(() => import('../pages/medical/MedicalOfficerRegisterPage.jsx'));
const ForgotPassword = lazy(() => import('../../../../packages/shared/src/pages/auth/ForgotPassword.jsx'));

// Admin Sections

// Medical Officer Sections
const MedicalOverviewSection = lazy(() => import('../features/medical/components/MedicalOverviewSection.jsx'));
const ConsultationsSection = lazy(() => import('../features/medical/components/ConsultationsSection.jsx'));
const MedicalArticleSection = lazy(() => import('../features/medical/components/MedicalArticleSection.jsx'));
const MedicalProfileSection = lazy(() => import('../features/medical/components/MedicalProfileSection.jsx'));
const MedicalArticleCreate = lazy(() => import('../features/medical/components/MedicalOfficerArticleCreatePage.jsx'));
const MedicalArticleEdit = lazy(() => import('../features/medical/components/MedicalOfficerArticleEditPage.jsx'));
const MedicalPredictionOversight = lazy(() => import('../features/medical/components/MedicalPredictionOversight.jsx'));
const MedicalActivitySection = lazy(() => import('../features/medical/components/MedicalActivitySection.jsx'));
const MedicalOfficerArticleViewPage = lazy(() => import('../features/medical/components/MedicalOfficerArticleViewPage.jsx'));
const UserArticleViewPage = lazy(() => import('../features/user/components/UserArticleViewPage.jsx'));

import ProtectedRoute from '../../../../packages/shared/src/routes/ProtectedRoute.jsx';

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
        <Route path="/medical-officer/login" element={<MedicalLogin />} />
        <Route path="/medical-officer/register" element={<MedicalRegister />} />
        <Route path="/medical-officer/forgot-password" element={<ForgotPassword mode="medicalOfficer" />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  );
}
function NotFound() {
 return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
  <p className="text-sm font-semibold text-emerald-700">404</p>
  <h1 className="text-3xl font-semibold text-slate-900">Page not found</h1>
  <p className="text-slate-600">This page is not available on this website.</p>
  <Link to="/" className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800">Back to home</Link>
 </main>;
}
