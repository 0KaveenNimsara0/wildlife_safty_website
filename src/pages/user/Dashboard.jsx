import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Menu, Award } from 'lucide-react';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

// User Feature Components
import ProfileSection from '../../features/user/components/ProfileSection';
import SecuritySection from '../../features/user/components/SecuritySection';
import PredictionHistorySection from '../../features/user/components/PredictionHistorySection';
import SavedArticlesSection from '../../features/user/components/SavedArticlesSection';
import ActivitySection from '../../features/user/components/ActivitySection';
import NotificationSection from '../../features/user/components/NotificationSection';
import UserSidebar from '../../features/user/components/UserSidebar';

const Dashboard = () => {
  const { 
    currentUser, 
    activeUser, 
    logout, 
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
  const [activeTab, setActiveTab] = useState('profile');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('System lockout failure.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row animate-fade-in">
      <UserSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeUser={activeUser} 
        handleLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-6 py-4 flex items-center justify-between lg:px-12">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                <Award size={12} />
                <span>Account Overview</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                User <span className="text-emerald-600">Dashboard</span>
              </h2>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-12 max-w-7xl lg:mx-auto w-full">
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

            <div className="card-premium p-10 bg-white shadow-2xl relative overflow-hidden min-h-[600px]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 -mr-16 -mt-16" />
              
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
                <ActivitySection userId={currentUser?.uid} />
              )}

              {activeTab === 'articles' && (
                <SavedArticlesSection />
              )}

              {activeTab === 'notifications' && (
                <NotificationSection />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
