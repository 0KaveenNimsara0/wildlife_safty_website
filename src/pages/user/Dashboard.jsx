import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// User Feature Components
import ProfileSection from '../../features/user/components/ProfileSection';
import SecuritySection from '../../features/user/components/SecuritySection';
import PredictionHistorySection from '../../features/user/components/PredictionHistorySection';
import SavedArticlesSection from '../../features/user/components/SavedArticlesSection';
import ActivitySection from '../../features/user/components/ActivitySection';
import UnifiedNotificationGrid from '../../components/notifications/UnifiedNotificationGrid';
import DashboardLayout from '../../layouts/DashboardLayout';

const Dashboard = () => {
  const { 
    currentUser, 
    activeUser, 
    updateEmail, 
    updatePassword, 
    sendEmailVerification, 
    verifyEmail, 
    uploadProfilePicture, 
    updateUserProfile,
    refreshUser 
  } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const location = useLocation();
  const isArticleView = location.pathname.includes('/dashboard/articles/');
  const activeTab = location.pathname.split('/')[2] || 'profile';
  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (['profile','security','history','activity','articles','notifications'].includes(tab)) navigate(`/dashboard/${tab}`, {replace:true});
  }, [location.search, navigate]);

  // Handle identity synchronization on mount to ensure verified status is current
  useEffect(() => {
    if (activeUser) {
      refreshUser().catch(err => console.error("Identity sync failure:", err));
    }
  }, []); // Only on mount

  return (
    <DashboardLayout role="user">
          <div className="space-y-8">
            {error && (
              <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-bold animate-shake">
                <FaExclamationTriangle size={18} /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 text-sm font-bold">
                <FaCheckCircle size={18} /> {success}
              </div>
            )}

            <div className="card-premium p-4 sm:p-6 bg-white shadow-sm relative overflow-hidden ">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 -mr-16 -mt-16" />
              
              {isArticleView ? (
                <Outlet />
              ) : (
                <>
                  {activeTab === 'profile' && (
                    <ProfileSection 
                      activeUser={activeUser}
                      updateEmail={updateEmail}
                      updateUserProfile={updateUserProfile}
                      sendEmailVerification={sendEmailVerification}
                      verifyEmail={verifyEmail}
                      uploadProfilePicture={uploadProfilePicture}
                      refreshUser={refreshUser}
                      setSuccess={setSuccess}
                      setError={setError}
                    />
                  )}

                  {activeTab === 'security' && (
                    <SecuritySection 
                      updatePassword={updatePassword}
                      setSuccess={setSuccess}
                      setError={setError}
                    />
                  )}

                  {activeTab === 'history' && (
                    <PredictionHistorySection />
                  )}

                  {activeTab === 'activity' && (
                    <ActivitySection userId={activeUser?.uid || currentUser?.uid} />
                  )}

                  {activeTab === 'articles' && (
                    <SavedArticlesSection />
                  )}

                  {activeTab === 'notifications' && (
                    <UnifiedNotificationGrid showHeader={false} />
                  )}
                </>
              )}
            </div>
          </div>
    </DashboardLayout>
  );
};

export default Dashboard;
