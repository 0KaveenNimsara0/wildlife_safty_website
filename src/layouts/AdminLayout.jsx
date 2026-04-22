import React, { useState } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { 
  Shield, 
  Menu, 
  Activity,
  Bell,
  Search,
  Home
} from 'lucide-react';
import AdminSidebar from '../features/admin/components/AdminSidebar';
import NotificationDropdown from '../components/notifications/NotificationDropdown';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Overview', path: '/admin/dashboard' },
    { name: 'User Control', path: '/admin/users' },
    { name: 'Medical Users', path: '/admin/medical-officers' },
    { name: 'Oversight Hub', path: '/admin/predictions' },
    { name: 'System Audit Logs', path: '/admin/audit' },
    { name: 'Communications', path: '/admin/chat' },
    { name: 'Medical Officer Articles', path: '/admin/articles' },
  ];

  const activeItem = menuItems.find(item => location.pathname === item.path) || menuItems[0];

  return (
    <div className="min-h-screen bg-[#fcfdfd] flex overflow-hidden">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

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
              <div className="h-8 w-px bg-slate-100 hidden md:block" />
              <div className="hidden md:flex items-center gap-3">
                <Link 
                  to="/" 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/50 hover:bg-emerald-50 text-slate-700 border border-slate-200 hover:border-emerald-200 hover:text-emerald-700 font-bold transition-all duration-300 shadow-sm group"
                >
                  <Home size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] uppercase tracking-widest">Return to Site</span>
                </Link>
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
                  <NotificationDropdown role="admin" />
                  <button className="p-2.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2">
                     <Search size={18} />
                     <span className="hidden lg:inline text-[9px] font-black tracking-widest uppercase px-1">Global Scan</span>
                  </button>
               </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
           <div className="max-w-[1600px] mx-auto animate-fade-in">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  );
}

