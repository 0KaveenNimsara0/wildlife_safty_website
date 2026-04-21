import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  Heart, 
  MessageCircle, 
  AlertCircle, 
  Clock, 
  Trash2, 
  CheckCheck 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { BASE_URL } from '../../../config/constants';

const NotificationSection = () => {
  const { activeUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('userToken');
      // Use uid from activeUser if available, though backend should extract from token
      const response = await fetch(`${BASE_URL}/notifications?uid=${activeUser.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to sync intelligence grid:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeUser) {
      fetchNotifications();
    }
  }, [activeUser]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: activeUser.uid })
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to update transmission status:', error);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ uid: activeUser.uid })
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to synchronize grid:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${BASE_URL}/notifications/${id}?uid=${activeUser.uid}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(notifications.filter(n => n._id !== id));
        // If it was unread, update count
        const wasUnread = notifications.find(n => n._id === id && !n.isRead);
        if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to purge transmission:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'POST_LIKED': return <Heart className="text-rose-500" size={18} />;
      case 'POST_COMMENTED':
      case 'REPLY_ADDED': return <MessageCircle className="text-sky-500" size={18} />;
      case 'POST_VERIFIED': return <CheckCircle className="text-emerald-500" size={18} />;
      case 'POST_REJECTED': return <AlertCircle className="text-amber-500" size={18} />;
      default: return <Bell className="text-slate-400" size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Scanning Intelligence Grid...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
        <div className="p-10 bg-slate-50 rounded-[2.5rem] text-slate-300 relative border border-slate-100 shadow-inner">
          <Bell size={64} className="opacity-20" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Intelligence Silence</h3>
          <p className="text-slate-400 font-medium max-w-xs leading-relaxed italic text-sm">Our sensors report no incoming transmissions for your authorized account at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Intelligence <span className="text-emerald-600 font-black">Grid</span>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full shadow-lg shadow-rose-200">
                {unreadCount} NEW
              </span>
            )}
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
             Real-time monitoring protocol engaged
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm"
          >
            <CheckCheck size={14} /> Clear Transmissions
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.map((notif) => (
          <div 
            key={notif._id}
            className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-start gap-6 
              ${notif.isRead 
                ? 'bg-white border-slate-50' 
                : 'bg-emerald-50/30 border-emerald-100/50 shadow-sm shadow-emerald-50'}`}
          >
            <div className={`p-4 rounded-2xl shadow-sm border ${notif.isRead ? 'bg-slate-50 border-slate-100' : 'bg-white border-emerald-100'}`}>
              {getIcon(notif.type)}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600">
                    {notif.type.replace(/_/g, ' ')}
                  </span>
                  {!notif.isRead && (
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                  <Clock size={10} /> {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <p className={`text-sm ${notif.isRead ? 'text-slate-500 font-medium' : 'text-slate-800 font-bold'}`}>
                {notif.message}
              </p>

              <div className="flex items-center gap-4 pt-2">
                {!notif.isRead && (
                  <button 
                    onClick={() => markAsRead(notif._id)}
                    className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline"
                  >
                    Mark Seen
                  </button>
                )}
                <button 
                  onClick={() => deleteNotification(notif._id)}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-rose-500 transition-colors"
                >
                  Purge
                </button>
              </div>
            </div>

            {/* Subtle Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="pt-10 flex flex-col items-center">
        <div className="w-16 h-1 bg-slate-100 rounded-full" />
        <p className="mt-4 text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">End of Transmissions</p>
      </div>
    </div>
  );
};

export default NotificationSection;
