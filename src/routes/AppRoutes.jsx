import React from 'react';
import { Routes, Route } from 'react-router-dom';

// User Pages
import Home from '../pages/user/Home';
import Identifier from '../pages/user/Identifier';
import Emergency from '../pages/user/Emergency';
import Learn from '../pages/user/Learn';
import Map from '../pages/user/Map';
import AnimalDetails from '../pages/user/AnimalDetails';
import CommunityFeed from '../pages/user/CommunityFeed';
import ArticleSelection from '../pages/user/ArticleSelection';
import UserPosts from '../pages/user/UserPosts';
import Chat from '../pages/user/Chat';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import MedicalOfficerManagement from '../pages/admin/MedicalOfficerManagement';
import AdminChat from '../pages/admin/Chat';
import AdminMedicalChat from '../pages/admin/AdminMedicalChat';
import AdminArticles from '../pages/admin/Articles';
import AdminLogin from '../pages/admin/AdminLoginPage'; 
import AdminRegister from '../pages/admin/AdminRegisterPage';

// Medical Officer Pages
import MedicalDashboard from '../pages/medical/Dashboard';
import Consultations from '../pages/medical/Consultations';
import MedicalArticles from '../pages/medical/Articles';
import MedicalProfile from '../pages/medical/MedicalOfficerProfilePage';
import MedicalLogin from '../pages/medical/MedicalOfficerLoginPage';
import MedicalRegister from '../pages/medical/MedicalOfficerRegisterPage';
import MedicalArticleCreate from '../pages/medical/MedicalOfficerArticleCreatePage';
import MedicalArticleEdit from '../pages/medical/MedicalOfficerArticleEditPage';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
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
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<ManageUsers />} />
      <Route path="/admin/medical-officers" element={<MedicalOfficerManagement />} />
      <Route path="/admin/chat" element={<AdminChat />} />
      <Route path="/admin/chat/officer/:officerId" element={<AdminMedicalChat />} />
      <Route path="/admin/articles" element={<AdminArticles />} />

      {/* Medical Officer Routes */}
      <Route path="/medical-officer/login" element={<MedicalLogin />} />
      <Route path="/medical-officer/register" element={<MedicalRegister />} />
      <Route path="/medical-officer/dashboard" element={<MedicalDashboard />} />
      <Route path="/medical-officer/chat" element={<Consultations />} />
      <Route path="/medical-officer/profile" element={<MedicalProfile />} />
      <Route path="/medical-officer/articles" element={<MedicalArticles />} />
      <Route path="/medical-officer/articles/create" element={<MedicalArticleCreate />} />
      <Route path="/medical-officer/articles/edit/:articleId" element={<MedicalArticleEdit />} />

      {/* Protected User Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Home />} />
      </Route>
    </Routes>
  );
}
