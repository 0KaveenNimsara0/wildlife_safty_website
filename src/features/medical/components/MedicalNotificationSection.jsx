import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  User, 
  Shield, 
  Clock,
  ExternalLink,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { BASE_URL } from '../../../config/constants';
import { formatDate, formatTime } from '../../../utils/formatters';

const MedicalNotificationSection = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to synchronize notification grid');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/notifications/read-all`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const itemToDelete = notifications.find(n => n._id === id);
        if (itemToDelete && !itemToDelete.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setNotifications(notifications.filter(n => n._id !== id));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'POST_VERIFIED': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'POST_REJECTED': return <X size={18} className="text-rose-500" />;
      case 'SYSTEM_ALERT': return <AlertCircle className="text-amber-500" size={18} />;
      case 'POST_COMMENTED': return <MessageSquare className="text-indigo-500" size={18} />;
      case 'PROFILE_UPDATED': return <User className="text-indigo-500" size={18} />;
      case 'PASSWORD_CHANGED': return <Shield className="text-amber-500" size={18} />;
      default: return <Bell className="text-slate-400" size={18} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'POST_VERIFIED': return 'bg-emerald-50/50 border-emerald-100';
      case 'POST_REJECTED': return 'bg-rose-50/50 border-rose-100';
      case 'SYSTEM_ALERT': return 'bg-amber-50/50 border-amber-100';
      default: return 'bg-slate-50/50 border-slate-100';
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
        <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing Intel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      {/* Header Area */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-4 sm:px-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Intelligence</h2>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full animate-pulse uppercase tracking-widest shadow-lg shadow-rose-200">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Alerts & Notifications</p>
        </div>

        {notifications.length > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 text-slate-600 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm transition-all hover:shadow-md active:scale-95"
          >
            <CheckCheck size={16} />
            Mark All Read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-6 text-center px-4">
          <div className="w-24 h-24 rounded-[40px] bg-white border border-slate-100 shadow-sm flex items-center justify-center opacity-40">
            <Bell size={40} className="text-slate-200" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Clear Frequency</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest max-w-xs mx-auto">No intelligence transmissions detected at this time.</p>
          </div>
          <button 
            onClick={fetchNotifications}
            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
          >
            Refresh Grid
          </button>
        </div>
      ) : (
        <div className="space-y-4 px-4 sm:px-0">
          {notifications.map((notification) => (
            <div 
              key={notification._id}
              className={`group p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                notification.isRead 
                  ? 'bg-white/40 border-slate-100 grayscale-[0.5] opacity-80' 
                  : 'bg-white border-white shadow-xl shadow-indigo-900/5 hover:shadow-indigo-900/10'
              }`}
            >
              {!notification.isRead && (
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
              )}
              
              <div className="flex gap-6">
                <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h4 className={`text-sm font-black tracking-tight leading-snug uppercase ${notification.isRead ? 'text-slate-500' : 'text-slate-900'}`}>
                      {notification.message}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        disabled={notification.isRead}
                        className={`p-2 rounded-xl transition-all ${notification.isRead ? 'text-slate-200' : 'text-slate-400 hover:bg-emerald-50 hover:text-emerald-500'}`}
                        title="Mark as Read"
                      >
                        <CheckCheck size={16} />
                      </button>
                      <button 
                        onClick={() => deleteNotification(notification._id)}
                        className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all"
                        title="Delete Alert"
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
                      <div className="flex items-center gap-1.5 text-indigo-500">
                        <User size={12} />
                        <span className="text-[10px] font-black uppercase tracking-tight">{notification.actor.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="hidden sm:flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <ChevronRight className="text-slate-300" size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {notifications.length > 5 && (
        <div className="mt-10 text-center">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">EndOf Grid Synchronized</p>
        </div>
      )}
    </div>
  );
};

export default MedicalNotificationSection;
