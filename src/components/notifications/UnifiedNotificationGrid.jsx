import React, { useState, useEffect } from 'react';
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
  TrendingUp,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { notificationApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTime } from '../../utils/formatters';

const UnifiedNotificationGrid = ({ limit = 50, showHeader = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { activeUser } = useAuth();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationApi.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      setError('Failed to synchronize intelligence frequency.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to update transmission status:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to synchronize grid status:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await notificationApi.deleteNotification(id);
      const item = notifications.find(n => n._id === id);
      if (item && !item.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Failed to purge transmission:', err);
    }
  };

  const handleRedirect = (notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Centralized Redirection Logic
    const rolePrefix = activeUser?.role === 'medicalOfficer' ? '/medical-officer' : (activeUser?.role === 'admin' ? '/admin' : '');

    switch (notification.type) {
      case 'POST_LIKED':
      case 'POST_REACTED':
      case 'POST_COMMENTED':
      case 'REPLY_ADDED':
      case 'POST_VERIFIED':
      case 'POST_REJECTED':
        navigate('/communityFeed');
        break;
      
      case 'ARTICLE_SUBMITTED':
        navigate('/admin/articles');
        break;
      
      case 'ARTICLE_APPROVED':
      case 'ARTICLE_REJECTED':
      case 'ARTICLE_PUBLISHED':
        if (activeUser?.role === 'user') {
          navigate('/learning');
        } else {
          navigate(`${rolePrefix}/articles`);
        }
        break;
      
      case 'MESSAGE_RECEIVED':
        navigate(activeUser?.role === 'user' ? '/chat' : `${rolePrefix}/chat`);
        break;
      
      case 'PROFILE_UPDATED':
      case 'PASSWORD_CHANGED':
        navigate(`${rolePrefix}/profile`);
        break;

      default:
        // Default fallback to dashboard
        if (activeUser?.role === 'user') navigate('/dashboard');
        else navigate(`${rolePrefix}/dashboard`);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'POST_VERIFIED': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'POST_REJECTED': return <XCircle className="text-rose-500" size={18} />;
      case 'POST_REACTED': return <Heart className="text-pink-500" size={18} fill="currentColor" />;
      case 'POST_COMMENTED': return <MessageSquare className="text-indigo-500" size={18} />;
      case 'ARTICLE_SUBMITTED': return <TrendingUp className="text-amber-500" size={18} />;
      case 'ARTICLE_APPROVED': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'ARTICLE_REJECTED': return <XCircle className="text-rose-500" size={18} />;
      case 'ARTICLE_PUBLISHED': return <ExternalLink className="text-sky-600" size={18} />;
      case 'MESSAGE_RECEIVED': return <MessageSquare className="text-sky-500" size={18} />;
      case 'PASSWORD_CHANGED': return <AlertCircle className="text-amber-600" size={18} />;
      default: return <Bell className="text-slate-400" size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Intelligence Grid...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {showHeader && (
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                {activeUser?.role === 'admin' ? 'Security Intelligence' : 'Intelligence'}
              </h2>
              {unreadCount > 0 && (
                <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full animate-pulse uppercase tracking-widest shadow-lg shadow-rose-200">
                  {unreadCount} New
                </span>
              )}
            </div>
            <button 
              onClick={() => {
                const dashboardPath = activeUser?.role === 'admin' ? '/admin/dashboard' : (activeUser?.role === 'medicalOfficer' ? '/medical-officer/dashboard' : '/dashboard');
                navigate(dashboardPath);
              }}
              className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-black text-[10px] uppercase tracking-widest mb-4 w-fit"
            >
               <ChevronRight size={14} className="rotate-180" />
               Go Back to {activeUser?.role === 'admin' ? 'Command Center' : 'Dashboard'}
            </button>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Global Transmission Feed</p>
          </div>

          {notifications.length > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-600 hover:text-emerald-600 hover:border-emerald-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all hover:shadow-md active:scale-95"
            >
              <CheckCheck size={16} />
              Synchronize All
            </button>
          )}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-6 text-center px-4">
          <div className="w-24 h-24 rounded-[40px] bg-white border border-slate-100 shadow-sm flex items-center justify-center opacity-40">
            <Bell size={40} className="text-slate-200" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Clear Frequency</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-xs mx-auto">No intelligence transmissions detected at this time.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4 px-4 sm:px-0">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              onClick={() => handleRedirect(notification)}
              className={`group p-6 rounded-3xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${
                notification.isRead 
                  ? 'bg-white/40 border-slate-100 grayscale-[0.5] opacity-80' 
                  : 'bg-white border-white shadow-xl shadow-emerald-900/5 hover:shadow-emerald-900/10'
              }`}
            >
              {!notification.isRead && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
              )}
              
              <div className="flex gap-6">
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-slate-50/50 border border-slate-100 group-hover:scale-110 duration-500`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className={`text-sm font-black tracking-tight leading-snug uppercase ${notification.isRead ? 'text-slate-500 font-bold' : 'text-slate-900'}`}>
                      {notification.message}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.isRead && (
                        <button 
                          onClick={(e) => handleMarkAsRead(notification._id, e)}
                          className="p-2 rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all"
                          title="Mark Seen"
                        >
                          <CheckCheck size={16} />
                        </button>
                      )}
                      <button 
                        onClick={(e) => handleDelete(notification._id, e)}
                        className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                        title="Purge Transmission"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-tight">
                        {formatDate(notification.createdAt)} at {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    {notification.actor && (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <User size={12} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{notification.actor.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-300">
                       <ExternalLink size={10} />
                       View Intel
                    </div>
                  </div>
                </div>

                <div className="hidden sm:flex items-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                   <ChevronRight className="text-emerald-500" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnifiedNotificationGrid;
