import React from 'react';
import UnifiedNotificationGrid from '../components/notifications/UnifiedNotificationGrid';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
    const { activeUser } = useAuth();
    const navigate = useNavigate();

    const getReturnPath = () => {
        if (!activeUser) return '/';
        if (activeUser.role === 'admin') return '/admin/dashboard';
        if (activeUser.role === 'medicalOfficer') return '/medical-officer/dashboard';
        return '/dashboard';
    };

    return (
        <div className="min-h-screen bg-[#fcfdfd] py-12 px-6 lg:px-12 animate-fade-in">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(getReturnPath())}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back to {activeUser?.role === 'user' ? 'Dashboard' : 'Command Center'}
                    </button>

                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                         <Shield size={14} className="text-emerald-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Secure Intelligence Link</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1" />
                    </div>
                </header>

                <UnifiedNotificationGrid />
            </div>
        </div>
    );
};

export default NotificationsPage;
