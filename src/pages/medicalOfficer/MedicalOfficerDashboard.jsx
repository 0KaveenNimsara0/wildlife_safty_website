import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Stethoscope,
  AlertCircle,
  Loader2,
  Activity,
  ShieldCheck,
  Maximize2,
  MessageSquare
} from 'lucide-react';

// Specialized Tactical Components
import ChatInterface from '../../components/ChatInterface';
import MedicalOfficerArticleHub from '../../components/medicalOfficer/MedicalOfficerArticleHub';

const API_BASE_URL = 'http://localhost:5000/api';

export default function MedicalOfficerDashboard() {
  const [medicalOfficerData, setMedicalOfficerData] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const pollingRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('medicalOfficerToken');
    const medicalOfficer = localStorage.getItem('medicalOfficerData');
    if (!token || !medicalOfficer) {
      navigate('/medical-officer/login');
      return;
    }
    setMedicalOfficerData(JSON.parse(medicalOfficer));
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (!medicalOfficerData) return;
    
    pollingRef.current = setInterval(() => {
      fetchConversations();
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [medicalOfficerData]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const fetchConversationsTask = fetchConversations().catch(err => console.error('[Dashboard] Signal Failure:', err));
    const fetchArticlesTask = fetch(`${API_BASE_URL}/medical-officer/articles/my-articles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('medicalOfficerToken')}` }
    }).then(res => res.ok ? res.json() : { articles: [] })
      .then(data => setArticles(data.articles || []))
      .catch(err => console.error('[Dashboard] Article Error:', err));

    try {
      await Promise.all([fetchConversationsTask, fetchArticlesTask]);
    } catch (err) {
      console.error('[Dashboard] Critical Failure:', err);
    }
    setLoading(false);
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/conversations`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (response.ok) {
        const data = await response.json();
        const userConversations = (data.conversations || []).filter(c => c.user);
        // We only need the count for dashboard
        return userConversations.length;
      }
      return 0;
    } catch (err) {
      console.error('[Dashboard] Signals Failure:', err);
      return 0;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
    navigate('/medical-officer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-6" />
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Loading Medical Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent">
      {error && (
        <div className="mb-8 bg-rose-50 border border-rose-100 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="text-rose-500" />
          <span className="text-sm font-semibold text-rose-700">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Panels */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                <div className="relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                      <Activity size={24} />
                   </div>
                   <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Patient Appointments</h3>
                   <p className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">24 Active</p>
                   <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Secure Channels Online
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
                   <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Emergency Alerts</h3>
                   <p className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">03 Queue</p>
                   <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mt-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Priority Attention Required
                   </p>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-8">
             <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Maximize2 size={80} />
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-4">Official Bulletin</h4>
                <p className="text-base font-medium leading-relaxed mb-6 text-slate-300">
                  Official communications are strictly for professional use. 
                  Ensure data privacy standards are upheld in all digital transmissions.
                </p>
                <div className="flex items-center gap-4">
                   <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                     Compliance: Active
                   </div>
                   <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                     Security: High
                   </div>
                </div>
             </div>

             <button 
               onClick={() => navigate('/medical-officer/chat')}
               className="w-full p-8 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-between group hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md"
             >
                <div className="text-left">
                   <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-indigo-600 group-hover:text-indigo-100">Messaging Center</h4>
                   <p className="text-xl font-bold">Access Communications</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 group-hover:bg-indigo-400 group-hover:text-white transition-all duration-300 shadow-sm">
                   <MessageSquare size={20} />
                </div>
             </button>
          </div>
        </div>

        {/* Sidebar panels */}
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
