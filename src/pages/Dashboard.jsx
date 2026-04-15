import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaShieldAlt, FaKey, FaHistory, FaBell, FaSignOutAlt, FaEdit, FaCamera, FaChevronRight, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { User, Shield, Key, History, Bell, LogOut, Camera, ChevronRight, Activity, Heart, Award, Mail, Lock, CheckCircle, XCircle, BookOpen, X, Loader2, AlertCircle } from 'lucide-react';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import UserFilesSection from '../components/UserFilesSection';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { currentUser, logout, updateEmail, updatePassword, sendEmailVerification, uploadProfilePicture } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [userActivity, setUserActivity] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [newEmail, setNewEmail] = useState(currentUser?.email || '');
  const [showProfileUpload, setShowProfileUpload] = useState(false);
  
  // New states for articles tab
  const [savedArticles, setSavedArticles] = useState([]);
  const [articlesStatus, setArticlesStatus] = useState({});
  const [articlesVerifying, setArticlesVerifying] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!currentUser) return;
      try {
        const response = await axios.get(`${API_URL}/posts`);
        const userPosts = response.data.filter(post => post.authorId === currentUser.uid);
        setUserActivity(userPosts);
      } catch (err) {
        console.error('Failed to sync activity log');
      }
    };
    fetchUserActivity();
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'articles') {
      const saved = JSON.parse(localStorage.getItem('wildsafe_review_later') || '[]');
      setSavedArticles(saved);
      verifyArticles(saved);
    }
  }, [activeTab]);

  const verifyArticles = async (articles) => {
    if (articles.length === 0) return;
    setArticlesVerifying(true);
    const statuses = {};
    
    try {
      await Promise.all(articles.map(async (art) => {
        try {
          const response = await axios.get(`${API_URL}/articles/${art._id}`);
          if (response.data.success && response.data.article) {
            statuses[art._id] = { ...response.data.article, isRemoved: false };
          } else {
            statuses[art._id] = { ...art, isRemoved: true };
          }
        } catch (err) {
          statuses[art._id] = { ...art, isRemoved: true };
        }
      }));
      setArticlesStatus(statuses);
    } finally {
      setArticlesVerifying(false);
    }
  };

  const handleRemoveSavedArticle = (e, id) => {
    e.stopPropagation();
    const updated = savedArticles.filter(a => a._id !== id);
    localStorage.setItem('wildsafe_review_later', JSON.stringify(updated));
    setSavedArticles(updated);
    const newStatuses = { ...articlesStatus };
    delete newStatuses[id];
    setArticlesStatus(newStatuses);
  };

  const openSavedArticle = (articleId) => {
    const art = articlesStatus[articleId];
    if (art && !art.isRemoved) {
      setSelectedArticle(art);
      setShowArticleModal(true);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Update email if changed
      if (newEmail !== currentUser.email) {
        await updateEmail(newEmail);
      }
      
      await updateProfileInfo(displayName, photoURL);
      setSuccess('Personnel profile updated successfully.');
    } catch (err) {
      setError(err.message || 'System rejected profile update.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError('Encryption mismatch: Passwords do not align.');
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await updatePassword(newPassword);
      setSuccess('Security credentials updated.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'System rejected credential update.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setError('');
      setSuccess('');
      await sendEmailVerification();
      setSuccess('Verification email transmitted to your authorized frequency. Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to transmit verification signal.');
    }
  };

  const handleProfilePhotoUpdate = async (file, previewUrl) => {
    try {
      setError('');
      setSuccess('');
      setSuccess('Uploading profile assets to central intelligence...');
      const photoURL = await uploadProfilePicture(file);
      setSuccess('Intelligence asset profile picture updated.');
      setShowProfileUpload(false);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Asset synchronization failed.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      setError('System lockout failure.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-slate-200 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">
            <Award size={16} />
            <span>Authenticated Sector</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Member <span className="text-emerald-600">Dossier</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            Secure management of your wildlife field data, security protocols, and operational history.
          </p>
        </div>

        <button onClick={handleLogout} className="btn-secondary py-4 px-8 flex items-center gap-3 border-rose-100 text-rose-600 hover:bg-rose-50 group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase tracking-widest text-[10px]">Secure Exit</span>
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          {[
            { id: 'profile', label: 'Identity Grid', icon: User },
            { id: 'security', label: 'Security Layer', icon: Shield },
            { id: 'articles', label: 'My Articles', icon: BookOpen },
            { id: 'activity', label: 'Field History', icon: Activity },
            { id: 'notifications', label: 'Inbound Commms', icon: Bell }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 ${
                activeTab === item.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]'
                  : 'bg-white text-slate-400 border-slate-50 hover:border-emerald-200 hover:text-emerald-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              <ChevronRight size={14} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
        </div>

        {/* Dynamic Content Sector */}
        <div className="lg:col-span-9 space-y-8">
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

          <div className="card-premium p-10 bg-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 -mr-16 -mt-16" />
            
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div className="flex items-center gap-8 pb-10 border-b border-slate-50">
                  <div className="relative group">
                    {showProfileUpload ? (
                      <div className="w-24 h-24 rounded-[2rem] overflow-hidden">
                        <ProfilePictureUpload 
                          currentPhoto={currentUser?.photoURL}
                          onPhotoChange={handleProfilePhotoUpdate}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white font-black text-4xl shadow-xl ring-8 ring-emerald-50 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                        {currentUser?.photoURL ? (
                          <img src={currentUser.photoURL} alt="Profile Asset" className="w-full h-full object-cover" />
                        ) : (
                          displayName?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase()
                        )}
                      </div>
                    )}
                    {!showProfileUpload && (
                      <button 
                        onClick={() => setShowProfileUpload(true)}
                        className="absolute -bottom-2 -right-2 p-3 bg-white rounded-xl shadow-lg border border-slate-100 text-emerald-600 hover:scale-110 transition-transform"
                      >
                        <Camera size={16} />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{displayName || 'Agent Unnamed'}</h3>
                    <div className="space-y-1">
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2 mt-1">
                        <FaEnvelope className="text-emerald-500" /> {currentUser?.email}
                      </p>
                      <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        {currentUser?.emailVerified ? (
                          <span className="text-emerald-600 flex items-center gap-1"><CheckCircle size={12} /> Verified Protocol</span>
                        ) : (
                          <>
                            <span className="text-rose-500 flex items-center gap-1"><XCircle size={12} /> Unverified Frequency</span>
                            <button onClick={handleVerifyEmail} className="text-emerald-600 hover:underline">Verify Frequency</button>
                          </>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Enlisted: {new Date(currentUser?.metadata?.creationTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Codename</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Authorized Email Address</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-slate-800"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" disabled={loading} className="btn-primary py-4 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-emerald-200">
                      Sync Intelligence Data
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-10">
                <div className="flex items-center gap-4 pb-8 border-b border-slate-50">
                  <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Credential Hardening</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Update Sector Access Keys</p>
                  </div>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-8 max-w-lg">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">New Access Key</label>
                    <div className="relative">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">Verify Key</label>
                    <div className="relative">
                      <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-rose-500 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all">
                    Commit Protocol Override
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="space-y-10">
                <div className="pb-8 border-b border-slate-50">
                  <h3 className="text-2xl font-black text-slate-900">Intelligence Assets</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Managed field documents and uploads</p>
                </div>
                <UserFilesSection userId={currentUser?.uid} />
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="space-y-10">
                <div className="flex items-center justify-between pb-8 border-b border-slate-50">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Intelligence Library</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bookmarks & Operational Intelligence</p>
                  </div>
                  {articlesVerifying && (
                    <div className="flex items-center gap-2 text-emerald-600 animate-pulse">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Syncing with HQ...</span>
                    </div>
                  )}
                </div>

                <div className="grid gap-6">
                  {savedArticles.length === 0 ? (
                    <div className="py-20 text-center flex flex-col items-center space-y-4 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                      <BookOpen size={48} className="text-slate-100" />
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your briefing library is empty</p>
                    </div>
                  ) : (
                    savedArticles.map((art) => {
                      const status = articlesStatus[art._id];
                      const isRemoved = status?.isRemoved;

                      return (
                        <div 
                          key={art._id}
                          onClick={() => !isRemoved && openSavedArticle(art._id)}
                          className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                            isRemoved 
                              ? 'bg-slate-50 border-slate-100 opacity-80' 
                              : 'bg-white border-slate-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                                  isRemoved ? 'bg-slate-200 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                  {art.category?.replace(/_/g, ' ') || 'INTEL'}
                                </span>
                                {isRemoved && (
                                  <span className="bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
                                    <AlertCircle size={10} /> Article Removed
                                  </span>
                                )}
                              </div>
                              <h4 className={`text-xl font-black tracking-tight ${isRemoved ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-emerald-600'}`}>
                                {art.title}
                              </h4>
                              <p className="text-sm text-slate-500 font-medium line-clamp-1 italic max-w-xl">
                                "{art.excerpt}"
                              </p>
                            </div>
                            
                            <button 
                              onClick={(e) => handleRemoveSavedArticle(e, art._id)}
                              className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                              title="Remove from Library"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                <div className="p-8 bg-sky-50 rounded-full text-sky-400 relative">
                  <Bell size={64} className="animate-bounce" />
                  <div className="absolute top-4 right-4 w-6 h-6 bg-rose-500 rounded-full border-4 border-white shadow-lg" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Zero Comms</h3>
                  <p className="text-slate-400 font-medium max-w-xs leading-relaxed italic">Intelligence grid reports no incoming transmissions for your current coordinates.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Viewer Modal */}
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-fade-in text-slate-900">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border-4 border-white">
            <header className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-1">
                <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-3 py-1 rounded-lg">Briefing Library</span>
                <h2 className="text-4xl font-black tracking-tight uppercase leading-tight mt-2">{selectedArticle.title}</h2>
              </div>
              <button 
                onClick={() => setShowArticleModal(false)}
                className="p-5 bg-white rounded-[2rem] shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 transition-all active:scale-95"
              >
                <X size={28} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-10 border-l-8 border-emerald-500 pl-10">
                  {selectedArticle.excerpt}
                </p>
                <div className="text-slate-800 text-xl leading-[2.2] font-medium whitespace-pre-wrap font-serif">
                  {selectedArticle.content}
                </div>
              </div>
              
              {selectedArticle.images && selectedArticle.images.length > 0 && (
                <div className="mt-12 space-y-8">
                  {selectedArticle.images.map((img, idx) => (
                    <img key={idx} src={img.url} alt="Intel asset" className="w-full rounded-[2.5rem] border-8 border-slate-50" />
                  ))}
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/80 flex justify-end">
              <button 
                onClick={() => setShowArticleModal(false)}
                className="bg-slate-900 text-white px-12 py-4 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-2xl transition-all"
              >
                Close Library Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
