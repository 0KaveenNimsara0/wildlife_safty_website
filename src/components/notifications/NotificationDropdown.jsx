import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  MessageSquare, 
  CheckCheck,
  ChevronRight,
  User,
  Heart,
  TrendingUp
} from 'lucide-react';
import { notificationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTime } from '../../utils/formatters';

const NotificationDropdown = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Mapping role names to API endpoints
  const fetchSummary = async () => {
    try {
      const countRes = await notificationApi.getUnreadCount();
      if (countRes.data.success) {
        setUnreadCount(countRes.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch unread summary:', err);
    }
  };

  const fetchRecent = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to fetch recent transmissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchRecent();
    }
  }, [isOpen]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark transmission as read:', err);
    }
  };

  const handleRedirect = (notification) => {
    setIsOpen(false);
    
    // Auto-mark as read on click
    if (!notification.isRead) {
      notificationApi.markAsRead(notification._id).catch(console.error);
    }

    // Logic for redirection based on type/entity
    const rolePrefix = role === 'medical' ? '/medical-officer' : (role === 'admin' ? '/admin' : '');

    switch (notification.entityType) {
      case 'Post':
        navigate('/communityFeed');
        break;
      case 'Article':
        if (role === 'medical') {
          navigate(`/medical-officer/articles/${notification.entityId}`);
        } else if (role === 'admin') {
          navigate('/admin/articles');
        } else {
          navigate('/learning');
        }
        break;
      case 'Prediction':
        if (role === 'user') {
          navigate('/dashboard');
        } else {
          navigate(`${rolePrefix}/predictions`);
        }
        break;
      case 'Chat':
        navigate(`${rolePrefix}/chat`);
        break;
      default:
        navigate(role === 'user' ? '/dashboard' : `${rolePrefix}/dashboard`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'POST_VERIFIED': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'POST_REJECTED': return <XCircle className="text-rose-500" size={16} />;
      case 'POST_REACTED': return <Heart className="text-pink-500" size={16} fill="currentColor" />;
      case 'POST_COMMENTED': return <MessageSquare className="text-indigo-500" size={16} />;
      case 'ARTICLE_SUBMITTED': return <TrendingUp className="text-amber-500" size={16} />;
      case 'MESSAGE_RECEIVED': return <MessageSquare className="text-sky-500" size={16} />;
      default: return <Bell className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Target Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl transition-all duration-300 relative group ${
          isOpen ? 'bg-emerald-50 text-emerald-600 shadow-inner' : 'bg-white text-slate-400 hover:text-emerald-500 border border-slate-100 shadow-sm'
        }`}
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-bounce' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-rose-500 border-2 border-white text-[9px] font-black text-white px-1 shadow-lg shadow-rose-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Grid */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden animate-fade-in z-[100]">
          {/* Header */}
          <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Intelligence Briefing</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Global Status Update</p>
            </div>
            {unreadCount > 0 && (
              <button 
                onClick={async () => {
                  try {
                    await notificationApi.markAllAsRead(apiRole);
                    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
                    setUnreadCount(0);
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:underline"
              >
                <CheckCheck size={12} />
                Clear All
              </button>
            )}
          </div>

          {/* List Area */}
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-10 flex flex-col items-center justify-center space-y-3 opacity-50">
                <div className="w-6 h-6 border-2 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Syncing Grid...</span>
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif._id}
                    onClick={() => handleRedirect(notif)}
                    className={`p-4 hover:bg-slate-50 transition-colors flex gap-4 cursor-pointer relative group ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}
                  >
                    {!notif.isRead && <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500" />}
                    
                    <div className="shrink-0 mt-1">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${!notif.isRead ? 'bg-white shadow-sm' : 'bg-slate-50'}`}>
                        {getIcon(notif.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed mb-1 ${!notif.isRead ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-2 text-[9px] font-medium text-slate-400 uppercase tracking-tight">
                        <Clock size={10} />
                        <span>{formatTime(notif.createdAt)} | {formatDate(notif.createdAt)}</span>
                      </div>
                    </div>

                    {!notif.isRead && (
                      <button 
                        onClick={(e) => handleMarkAsRead(notif._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600 transition-all"
                        title="Dismiss"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell size={24} className="text-slate-300" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Intelligence Data</p>
              </div>
            )}
          </div>

          {/* Footer Area */}
          <button 
            onClick={() => {
              setIsOpen(false);
              const notifPath = role === 'admin' ? '/admin/notifications' : (role === 'medical' ? '/medical-officer/notifications' : '/notifications');
              navigate(notifPath);
            }}
            className="w-full p-4 text-center border-t border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-600 transition-colors">Complete Intel Feed</span>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
