import React from 'react';
import { 
  User, 
  Shield, 
  BookOpen, 
  Activity, 
  Bell, 
  LogOut, 
  ChevronRight,
  X,
  CreditCard,
  Settings
} from 'lucide-react';

const UserSidebar = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  handleLogout, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const menuItems = [
    { id: 'profile', label: 'Identity Grid', icon: User },
    { id: 'security', label: 'Security Layer', icon: Shield },
    { id: 'articles', label: 'My Articles', icon: BookOpen },
    { id: 'activity', label: 'Field History', icon: Activity },
    { id: 'notifications', label: 'Inbound Comms', icon: Bell }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header/Logo Section */}
          <div className="p-8 pb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-slate-900 rounded-2xl shadow-xl">
                <CreditCard size={20} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Sector <span className="text-emerald-600">HQ</span>
                </h1>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Observer Terminal</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            <div className="px-4 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Operations</span>
            </div>
            
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group
                    ${isActive 
                      ? 'bg-slate-900 text-white shadow-2xl scale-[1.02] border-2 border-slate-800' 
                      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 border-2 border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <item.icon size={18} className={`${isActive ? 'text-emerald-500' : 'group-hover:text-emerald-600'} transition-colors`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                </button>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="p-6 border-t border-slate-50 bg-slate-50/30">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white border border-slate-100 mb-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate tracking-tight">
                  {currentUser?.displayName || 'Observer'}
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                  Authenticated Level 1
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-300 font-black text-[10px] uppercase tracking-widest group shadow-sm"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Terminate Session
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;
