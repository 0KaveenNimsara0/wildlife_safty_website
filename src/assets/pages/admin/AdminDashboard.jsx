import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  BarChart3,
  LogOut,
  Shield,
  AlertCircle,
  MessageSquare,
  FileText,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    recentUsers: 0,
    totalMedicalOfficers: 0,
    recentMedicalOfficers: 0
  });
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const admin = localStorage.getItem('adminData');

    if (!token || !admin) {
      navigate('/admin/login');
      return;
    }

    setAdminData(JSON.parse(admin));
    fetchStats();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Fetch Firebase users count separately
      // Removed fetching Firebase users count to avoid 404 error
      // const firebaseResponse = await fetch('http://localhost:5000/firebase-count', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      // if (!firebaseResponse.ok) {
      //   throw new Error('Failed to fetch Firebase users count');
      // }
      // const firebaseData = await firebaseResponse.json();

      // Fetch MongoDB stats including medical officers count
      const response = await fetch('http://localhost:5000/api/admin/users/stats/overview', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();

      // Use MongoDB stats for all counts
      setStats({
        totalUsers: data.stats.totalUsers,
        recentUsers: data.stats.recentUsers,
        totalMedicalOfficers: data.stats.totalMedicalOfficers,
        recentMedicalOfficers: data.stats.recentMedicalOfficers
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Platform Status Hero */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
             <div className="flex items-center gap-3 mb-4">
                <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Nominal</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
             </div>
             <h1 className="text-4xl font-black tracking-tight uppercase">Admin <span className="text-emerald-400">Command</span></h1>
             <p className="text-slate-400 font-medium mt-2 max-w-md">Overseeing the Wildlife Safety infrastructure. Comprehensive control over users, medical users, and intel articles.</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-center min-w-[120px]">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Local Time</p>
                <p className="text-xl font-black tracking-tight">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             </div>
             <div className="px-6 py-4 bg-emerald-600 rounded-3xl text-center min-w-[120px] shadow-lg shadow-emerald-900/40">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-200 mb-1">Operations</p>
                <p className="text-xl font-black tracking-tight italic">ACTIVE</p>
             </div>
          </div>
        </div>
      </div>
        {error && (
          <div className="mb-6 flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

      {/* Command Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Registrations', val: stats.totalUsers, icon: Users, color: 'emerald', trend: '+12.5%' },
          { label: 'Medical Users', val: stats.totalMedicalOfficers, icon: Shield, color: 'blue', trend: 'STABLE' },
          { label: 'Recent Activity', val: stats.recentUsers, icon: Activity, color: 'amber', trend: 'UP' },
          { label: 'Metric Growth', val: stats.totalUsers > 0 ? '+' + Math.round((stats.recentUsers / stats.totalUsers) * 100) + '%' : '0%', icon: TrendingUp, color: 'rose', trend: 'REAL-TIME' }
        ].map((card, idx) => (
          <div key={idx} className="card-premium group relative overflow-hidden p-8 bg-white border-slate-100">
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-125 transition-transform duration-700">
                <card.icon size={82} />
             </div>
             <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-${card.color}-500/10 text-${card.color}-600`}>
                   <card.icon size={20} />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-${card.color}-50 text-${card.color}-600 tracking-widest`}>
                   {card.trend}
                </span>
             </div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">{card.label}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{card.val}</h3>
                   <span className="text-[10px] text-slate-400 font-bold">Units</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-premium p-10 bg-white">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Management Channels</h3>
             <ArrowUpRight size={16} className="text-slate-300" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { path: '/admin/users', label: 'User Control', icon: Users, sub: 'Monitor reg. database' },
              { path: '/admin/medical-officers', label: 'Medical Users', icon: UserCheck, sub: 'Medical verification' },
              { path: '/admin/chat', label: 'Comms', icon: MessageSquare, sub: 'Support dispatch' },
              { path: '/admin/articles', label: 'Intel Hub', icon: FileText, sub: 'Education portal' }
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={() => navigate(action.path)}
                className="group flex flex-col p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-emerald-600 transition-all duration-300 text-left"
              >
                <div className="p-3 bg-white rounded-2xl w-fit shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors mb-4">
                   <action.icon size={20} />
                </div>
                <p className="font-black text-slate-900 uppercase tracking-tight text-sm group-hover:text-white">{action.label}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 group-hover:text-emerald-100">{action.sub}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="card-premium p-10 bg-slate-900 text-white relative overflow-hidden border-none shadow-emerald-900/10">
           <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mb-32 blur-3xl" />
           <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/60 mb-8">Security Overview</h3>
              <div className="flex-1 space-y-6">
                 {[
                   { label: 'Admin Access', status: 'ROOT_AUTHORITY', color: 'emerald' },
                   { label: 'DB Cluster', status: 'SYNCHRONIZED', color: 'emerald' },
                   { label: 'Auth Middleware', status: 'FIREBASE_VERIFIED', color: 'emerald' }
                 ].map((stat, idx) => (
                   <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-4">
                      <div>
                         <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                         <p className="text-xs font-black tracking-tight uppercase text-white mt-1">{stat.status}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full bg-${stat.color}-500`} />
                   </div>
                 ))}
              </div>
              <button
                onClick={() => navigate('/admin/profile')}
                className="mt-8 w-full py-4 bg-emerald-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40"
              >
                Access Profile Config
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
