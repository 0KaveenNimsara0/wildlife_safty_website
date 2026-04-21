import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/constants';
import {
  Activity,
  ShieldCheck,
  AlertCircle,
  Maximize2,
  MessageSquare
} from 'lucide-react';

import MedicalOfficerArticleHub from './MedicalOfficerArticleHub';

export default function MedicalOverviewSection() {
  const [medicalOfficerData, setMedicalOfficerData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const medicalOfficer = localStorage.getItem('medicalOfficerData');
    if (medicalOfficer) {
      setMedicalOfficerData(JSON.parse(medicalOfficer));
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/articles/my-articles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error('[Dashboard] Article Error:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-30">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent animate-fade-in">
      {error && (
        <div className="mb-8 bg-rose-50 border border-rose-100 px-6 py-4 rounded-2xl flex items-center gap-4 animate-shake">
          <AlertCircle className="text-rose-500" />
          <span className="text-sm font-black text-rose-700 uppercase tracking-widest">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <Activity size={24} />
                   </div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Patient Chats</h3>
                    <p className="text-3xl font-black text-slate-900 leading-tight tracking-tight">24 Active</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                       Online
                    </p>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                   <ShieldCheck size={120} />
                </div>
             </div>

             <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                      <AlertCircle size={24} />
                   </div>
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">Alerts</h3>
                    <p className="text-3xl font-black text-slate-900 leading-tight tracking-tight">03 Queue</p>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                       Action Needed
                    </p>
                 </div>
              </div>
           </div>

           <div className="flex flex-col gap-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group shadow-xl">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Maximize2 size={80} />
                 </div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4">Important Notices</h4>
                 <p className="text-base font-medium leading-relaxed mb-6 text-slate-300 italic uppercase tracking-tight">
                    Official messages are for professional use. 
                    Keep data privacy standards high in all messages.
                 </p>
                 <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500">
                       Status: Active
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500">
                       Security: High
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => navigate('/medical-officer/chat')}
                className="w-full p-8 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-between group hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md active:scale-[0.98]"
              >
                 <div className="text-left">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 text-indigo-600 group-hover:text-indigo-100">Messages</h4>
                    <p className="text-2xl font-black uppercase tracking-tight">View All Chats</p>
                 </div>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 group-hover:bg-indigo-400 group-hover:text-white transition-all duration-300 shadow-sm">
                   <MessageSquare size={24} />
                </div>
             </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <MedicalOfficerArticleHub
            articles={articles}
            onCreateArticle={() => navigate('/medical-officer/articles/create')}
            onEditArticle={(article) => navigate(`/medical-officer/articles/edit/${article._id}`)}
          />
        </div>
      </div>
    </div>
  );
}
