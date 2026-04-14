import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  Activity,
  ChevronRight,
  Bell,
  Search
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const admin = localStorage.getItem('adminData');
    if (admin) {
      setAdminData(JSON.parse(admin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Control', icon: Users, path: '/admin/users' },
    { name: 'Medical Users', icon: UserCheck, path: '/admin/medical-officers' },
    { name: 'Communications', icon: MessageSquare, path: '/admin/chat' },
    { name: 'Intelligence hub', icon: FileText, path: '/admin/articles' },
  ];

  const activeItem = menuItems.find(item => location.pathname === item.path) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#fcfdfd] flex overflow-hidden">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modern Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-900/20">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight uppercase leading-none">Admin <span className="text-emerald-400">Hub</span></h1>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">Control Center 2.0</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
             <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Infrastructure</p>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-400/5' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={20} className={`transition-colors ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="text-sm font-black tracking-tight uppercase">{item.name}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-800/30 border border-slate-800 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center font-black text-slate-300">
                {adminData?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-200 truncate tracking-tight">{adminData?.name || 'Administrator'}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">Root Access</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest"
            >
              <LogOut size={16} />
              Term. Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Dynamic Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between z-30 flex-shrink-0">
           <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors">
                <Menu size={24} />
              </button>
              <div className="hidden md:flex items-center gap-3">
                 <div className="flex flex-col">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Current Node</h2>
                    <p className="text-sm font-black text-slate-900 tracking-tight uppercase">{activeItem.name}</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
               {/* Global Status Indicators */}
               <div className="hidden sm:flex items-center gap-4 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Network UP</span>
                  </div>
                  <div className="w-px h-3 bg-slate-200" />
                  <Activity size={14} className="text-emerald-500" />
               </div>

               <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-xl bg-white text-slate-400 hover:text-emerald-500 border border-slate-100 shadow-sm transition-all active:scale-90">
                     <Bell size={18} />
                  </button>
                  <button className="p-2.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2">
                     <Search size={18} />
                     <span className="hidden lg:inline text-[9px] font-black tracking-widest uppercase px-1">Global Scan</span>
                  </button>
               </div>
           </div>
        </header>

        {/* Child Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="max-w-[1600px] mx-auto animate-fade-in">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
