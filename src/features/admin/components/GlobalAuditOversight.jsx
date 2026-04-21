import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../../config/constants';
import ActivityTimeline from '../../../components/ui/ActivityTimeline';
import { 
    Shield, 
    Search, 
    Filter, 
    User, 
    Calendar, 
    Zap,
    Download,
    RefreshCw
} from 'lucide-react';

const GlobalAuditOversight = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        userId: '',
        userName: '',
        userEmail: '',
        role: '',
        action: '',
        startDate: '',
        endDate: ''
    });

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.userId) queryParams.append('userId', filters.userId);
            if (filters.userName) queryParams.append('userName', filters.userName);
            if (filters.userEmail) queryParams.append('userEmail', filters.userEmail);
            if (filters.role) queryParams.append('role', filters.role);
            if (filters.action) queryParams.append('action', filters.action);
            if (filters.startDate) queryParams.append('startDate', filters.startDate);
            if (filters.endDate) queryParams.append('endDate', filters.endDate);

            const response = await fetch(`${BASE_URL}/audit?${queryParams.toString()}`);
            const data = await response.json();
            if (data.success) {
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Audit fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight">System Audit Log</h3>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Global activity oversight & security forensics</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <button 
                        onClick={fetchLogs}
                        className="p-4 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
                        <Download size={16} />
                        Export Forensic Data
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Filter size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Advanced Filtering Engine</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Actor Details Row */}
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input 
                            name="userName"
                            value={filters.userName}
                            onChange={handleFilterChange}
                            type="text" 
                            placeholder="Search Name..." 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>

                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input 
                            name="userEmail"
                            value={filters.userEmail}
                            onChange={handleFilterChange}
                            type="text" 
                            placeholder="Search Email..." 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <input 
                            name="userId"
                            value={filters.userId}
                            onChange={handleFilterChange}
                            type="text" 
                            placeholder="Actor ID..." 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="relative group">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <select 
                            name="role"
                            value={filters.role}
                            onChange={handleFilterChange}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                        >
                            <option value="">All Roles</option>
                            <option value="user">Regular Users</option>
                            <option value="medical_officer">Medical Officers</option>
                            <option value="admin">Administrators</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Action Filter */}
                    <div className="relative group">
                        <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={14} />
                        <select 
                            name="action"
                            value={filters.action}
                            onChange={handleFilterChange}
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 outline-none appearance-none transition-all cursor-pointer"
                        >
                            <option value="">All Actions</option>
                            <option value="LOGIN">Logins</option>
                            <option value="REGISTER">Registrations</option>
                            <option value="PREDICTION_SAVED">Predictions</option>
                            <option value="POST_CREATED">Community Activity</option>
                            <option value="PASSWORD_UPDATE">Security Events</option>
                        </select>
                    </div>

                    {/* Date Filters */}
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={14} />
                        <input 
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            type="date" 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 transition-all cursor-pointer outline-none"
                        />
                    </div>
                    <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={14} />
                        <input 
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            type="date" 
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-indigo-500 transition-all cursor-pointer outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Timeline Results */}
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                <ActivityTimeline logs={logs} loading={loading} />
            </div>
        </div>
    );
};

export default GlobalAuditOversight;
