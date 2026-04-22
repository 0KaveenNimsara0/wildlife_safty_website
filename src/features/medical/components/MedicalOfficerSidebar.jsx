import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  LogOut, 
  ShieldCheck,
  Activity,
  User,
  Settings,
  X,
  Bell
} from 'lucide-react';

const MedicalOfficerSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const [officerData, setOfficerData] = React.useState(null);

  React.useEffect(() => {
    const data = localStorage.getItem('medicalOfficerData');
    if (data) {
      setOfficerData(JSON.parse(data));
    }

    const handleStorage = () => {
      const updated = localStorage.getItem('medicalOfficerData');
      if (updated) setOfficerData(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/medical-officer/dashboard', icon: LayoutDashboard },
    { name: 'Check Discoveries', path: '/medical-officer/predictions', icon: Activity },
    { name: 'Messages', path: '/medical-officer/chat', icon: MessageSquare },
    { name: 'Articles', path: '/medical-officer/articles', icon: FileText },
    { name: 'Notifications', path: '/medical-officer/notifications', icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
    navigate('/medical-officer/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="h-20 flex items-center px-8 border-b border-white/5 relative bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-wider uppercase">Medical Portal</h1>
                <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Account Dashboard</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden absolute right-6 text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon size={18} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-semibold">{item.name}</span>
                {item.name === 'Message Center' && (
                   <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400" />
                )}
              </NavLink>
            ))}
            
            <div className="pt-6 pb-2">
               <div className="h-px bg-white/5 mx-4" />
               <p className="px-5 py-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Administration</p>
            </div>

            <NavLink
              to="/medical-officer/profile"
              className={({ isActive }) => `
                flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group
                ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}
            >
              <User size={18} />
              <span className="text-xs font-semibold">Profile</span>
            </NavLink>

            <button
               onClick={handleLogout}
               className="w-full flex items-center gap-4 px-5 py-3.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-200 mt-auto"
            >
               <LogOut size={18} />
               <span className="text-xs font-semibold">Logout</span>
            </button>
          </nav>

          {/* Footer Card */}
          <div className="p-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group mb-4">
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-lg overflow-hidden">
                  {officerData?.photoURL ? (
                    <img src={officerData.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${officerData.photoURL}` : officerData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    officerData?.name?.charAt(0).toUpperCase() || 'M'
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-white truncate">{officerData?.name || 'Medical Officer'}</p>
                  <p className="text-[8px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Active Session</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative overflow-hidden group">
              <div className="relative z-10 text-center">
                <p className="text-[10px] font-bold text-slate-300 mb-1">System Version</p>
                <p className="text-[9px] font-medium text-slate-500">Node Release 0.0.1v</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MedicalOfficerSidebar;
