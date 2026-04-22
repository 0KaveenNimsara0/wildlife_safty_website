import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../../config/constants';
import ActivityTimeline from '../../../components/ui/ActivityTimeline';
import { Clock, Shield, History, Activity } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const MedicalActivitySection = ({ userId: propUserId }) => {
  const { activeUser } = useAuth();
  const userId = propUserId || activeUser?._id;
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Using the same audit endpoint as regular users
        const response = await fetch(`${BASE_URL}/audit/user/${userId}`);
        const data = await response.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (error) {
        console.error('Failed to load professional activity logs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchLogs();
  }, [userId]);

  return (
    <div className="space-y-10 focus:outline-none animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-100">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
                 <History size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Professional Oversight</h3>
           </div>
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.25em] ml-14">Immutable operational & security history</p>
        </div>
        
        <div className="flex items-center gap-3 px-5 py-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm">
           <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
           <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Expert Activity Tracking Active</span>
        </div>
      </div>

      <div className="max-w-4xl bg-white p-10 rounded-[40px] border border-slate-50 shadow-xl shadow-slate-200/40">
        <ActivityTimeline logs={logs} loading={loading} />
      </div>

      <div className="p-8 rounded-[32px] bg-slate-900 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
         <div className="relative z-10 flex items-center gap-6">
            <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10">
               <Shield size={24} className="text-indigo-400" />
            </div>
            <div>
               <h4 className="text-sm font-black uppercase tracking-widest mb-1">Security Protocol Active</h4>
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic uppercase tracking-wider">
                  Every interaction within the WildSafe Medical Grid is cryptographically hashed and logged for professional compliance.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MedicalActivitySection;
