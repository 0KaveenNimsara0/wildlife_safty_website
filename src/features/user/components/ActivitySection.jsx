import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../../config/constants';
import ActivityTimeline from '../../../components/ui/ActivityTimeline';
import { Clock, Shield } from 'lucide-react';

const ActivitySection = ({ userId }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/audit/user/${userId}`);
        const data = await response.json();
        if (data.success) {
          setLogs(data.logs);
        }
      } catch (error) {
        console.error('Failed to load activity logs:', error);
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
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                 <Shield size={20} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Activity Intelligence</h3>
           </div>
           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] ml-11">Immutable session & security history</p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Real-time Logging Active</span>
        </div>
      </div>

      <div className="max-w-3xl">
        <ActivityTimeline logs={logs} loading={loading} />
      </div>
    </div>
  );
};

export default ActivitySection;
