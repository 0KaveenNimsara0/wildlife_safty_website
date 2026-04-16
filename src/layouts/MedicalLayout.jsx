import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  Activity,
  Bell,
  Search,
  Scan
} from 'lucide-react';
import MedicalOfficerSidebar from '../features/medical/components/MedicalOfficerSidebar';

export default function MedicalOfficerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/medical-officer/dashboard' },
    { name: 'Message Center', path: '/medical-officer/chat' },
    { name: 'Medical Knowledge', path: '/medical-officer/articles' },
  ];

  const activeItem = menuItems.find(item => location.pathname === item.path) || menuItems[0];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <MedicalOfficerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Clean Professional Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between z-30 flex-shrink-0">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-2 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border border-slate-200"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:flex items-center gap-4">
                 <div className="flex flex-col">
                    <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Medical Portal</h2>
                    <p className="text-base font-bold text-slate-900 tracking-tight">{activeItem.name}</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
               <div className="hidden sm:flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                     <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">System Online</span>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <button className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all relative">
                     <Bell size={18} />
                     <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2 border-white" />
                  </button>
                  
                  <div className="h-8 w-px bg-slate-200 mx-2" />
                  
                  <button className="flex items-center gap-3 pl-2 pr-1 rounded-xl hover:bg-slate-50 transition-all group">
                     <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-900 leading-none">Medical Officer</p>
                        <p className="text-[9px] font-medium text-slate-400 mt-1">Status: Active</p>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                        MO
                     </div>
                  </button>
               </div>
           </div>
        </header>

        {/* Child Content Rendering */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
           <div className="max-w-[1600px] mx-auto">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
}
