import React from 'react';
import { 
    Clock, 
    Key, 
    ShieldCheck, 
    MessageSquare, 
    FileText, 
    User, 
    Settings,
    MoreHorizontal,
    Monitor,
    Globe,
    Zap,
    PlusCircle,
    Edit3,
    Trash2,
    Heart
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const ActionIcon = ({ action }) => {
    if (action.includes('LOGIN') || action.includes('REGISTER')) return <Key size={14} className="text-indigo-600" />;
    if (action.includes('PREDICTION')) return <Zap size={14} className="text-amber-600" />;
    if (action.includes('POST') || action.includes('COMMENT')) return <MessageSquare size={14} className="text-emerald-600" />;
    if (action.includes('PASSWORD') || action.includes('VERIF')) return <ShieldCheck size={14} className="text-rose-600" />;
    if (action.includes('PROFILE')) return <User size={14} className="text-sky-600" />;
    return <Clock size={14} className="text-slate-400" />;
};

const ActivityTimeline = ({ logs, loading }) => {
    if (loading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Audit Logs...</span>
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
                <div className="p-4 bg-slate-50 rounded-full">
                    <Clock size={20} className="opacity-20" />
                </div>
                <span className="text-xs font-bold">No activity recorded yet for this period.</span>
            </div>
        );
    }

    return (
        <div className="relative pl-8 space-y-8 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
            {logs.map((log) => (
                <div key={log._id} className="relative animate-fade-in group">
                    {/* Icon Node */}
                    <div className="absolute -left-8 top-1.5 w-7 h-7 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform">
                        <ActionIcon action={log.action} />
                    </div>

                    <div className="space-y-2">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h4 className="text-sm font-black text-slate-900 tracking-tight">
                                {log.action.replace(/_/g, ' ')}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                                <Clock size={10} />
                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow group-hover:border-indigo-100">
                            <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                {log.details}
                            </p>

                            <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <Monitor size={10} />
                                    {log.userAgent.includes('Windows') ? 'Desktop' : 'Mobile'}
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <Globe size={10} />
                                    {log.ipAddress}
                                </div>
                                
                                <div className="ml-auto flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{log.entityType}</span>
                                    <span className="text-[9px] font-mono text-slate-200">#{(log.entityId || '').slice(-6)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityTimeline;
