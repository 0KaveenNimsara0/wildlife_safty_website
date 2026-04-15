import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Stethoscope,
  AlertCircle,
  Loader2,
  Activity,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

// Specialized Tactical Components
import ChatInterface from '../../components/ChatInterface';
import MedicalOfficerUserChat from '../../components/medicalOfficer/MedicalOfficerUserChat';
import MedicalOfficerArticleHub from '../../components/medicalOfficer/MedicalOfficerArticleHub';

const API_BASE_URL = 'http://localhost:5000/api';

export default function MedicalOfficerDashboard() {
  const [medicalOfficerData, setMedicalOfficerData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
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
      if (selectedAdmin) {
        fetchAdminMessages(selectedAdmin._id);
      }
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [medicalOfficerData, selectedAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    const fetchAdminsTask = fetchAdmins().catch(err => console.error('[Dashboard] Admin Discovery Failure:', err));
    const fetchConversationsTask = fetchConversations().catch(err => console.error('[Dashboard] Signal Failure:', err));
    const fetchArticlesTask = fetch(`${API_BASE_URL}/medical-officer/articles/my-articles`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('medicalOfficerToken')}` }
    }).then(res => res.ok ? res.json() : { articles: [] })
      .then(data => setArticles(data.articles || []))
      .catch(err => console.error('[Dashboard] Article Error:', err));

    try {
      await Promise.all([fetchAdminsTask, fetchConversationsTask, fetchArticlesTask]);
    } catch (err) {
      console.error('[Dashboard] Critical Failure:', err);
    }
    setLoading(false);
  };

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.admins)) {
        setAdmins(data.admins);
        if (data.admins.length > 0 && !selectedAdmin) {
          handleSelectAdmin(data.admins[0]);
        }
      }
    } catch (err) {
      console.error('[Dashboard] Admin Discovery Failure:', err);
    }
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/conversations`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error('[Dashboard] Signal Failure:', err);
    }
  };

  const handleSelectAdmin = async (admin) => {
    if (!admin || !admin._id) return;
    if (selectedAdmin?._id === admin._id) return;
    setSelectedAdmin(admin);
    fetchAdminMessages(admin._id);
  };

  const fetchAdminMessages = async (adminId) => {
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const conv = (data.conversations || []).find(c => c.admin?._id === adminId);
        if (conv) {
          const msgResponse = await fetch(`${API_BASE_URL}/medical-officer/chat/messages/${conv._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (msgResponse.ok) {
            const msgData = await msgResponse.json();
            setAdminMessages(msgData.messages || []);
          }
        }
      }
    } catch (err) {
      console.error('[Dashboard] Admin Acquisition Failure:', err);
    }
  };

  const handleConversationSelect = async (conversation) => {
    if (currentConversation?._id === conversation._id) return;
    setCurrentConversation(conversation);
    setChatLoading(true);
    setMessages([]);
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/messages/${conversation._id}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      setError('Failed to load signal history.');
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessageToUser = async (message) => {
    if (!currentConversation || !currentConversation.user?.uid) return;
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/send/${currentConversation.user.uid}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, data.message]);
        await fetchConversations();
      }
    } catch (err) {
      setError('Signal transmission error.');
    }
  };

  const handleSendMessageToAdmin = async (message) => {
    if (!selectedAdmin) return;
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/send/${selectedAdmin._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message, receiverType: 'admin' })
      });
      if (response.ok) {
        const data = await response.json();
        setAdminMessages(prev => [...prev, data.message]);
      }
    } catch (error) {
       console.error('Admin Uplink Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('medicalOfficerToken');
    localStorage.removeItem('medicalOfficerData');
    navigate('/medical-officer/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mx-auto mb-6" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Initializing Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <main className="w-full">
        {error && (
          <div className="mb-10 glass bg-rose-50 border-rose-200 px-6 py-4 rounded-[2rem] flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <AlertCircle className="text-rose-500" />
            <span className="text-xs font-black uppercase tracking-widest text-rose-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Signal Center - Primary Focal Point */}
          <div className="lg:col-span-8 h-full">
            <MedicalOfficerUserChat
              conversations={conversations}
              currentConversation={currentConversation}
              messages={messages}
              onConversationSelect={handleConversationSelect}
              onSendMessage={handleSendMessageToUser}
              loading={chatLoading}
              error={error}
            />
          </div>

          {/* Intelligence Modules - Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10 overflow-y-auto pr-2 custom-scrollbar">
            <MedicalOfficerArticleHub
              articles={articles}
              onCreateArticle={() => navigate('/medical-officer/articles/create')}
              onEditArticle={(article) => navigate(`/medical-officer/articles/edit/${article._id}`)}
            />
            
            <div className="h-[700px]">
               <ChatInterface
                 title="Tactical Uplink: Admin"
                 messages={adminMessages}
                 onSendMessage={handleSendMessageToAdmin}
                 participant={selectedAdmin}
                 admins={admins}
                 selectedAdminId={selectedAdmin?._id}
                 onAdminSelect={handleSelectAdmin}
                 currentSenderId={medicalOfficerData?._id}
                 placeholder="Draft admin dispatch..."
               />
            </div>

            <div className="p-8 glass card-premium rounded-[2.5rem] bg-emerald-950 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Maximize2 size={80} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-400 mb-4">Command Alert</h4>
              <p className="text-sm font-bold leading-relaxed mb-6">
                All transmissions are recorded on an immutable ledger. 
                Ensure communication protocols are maintained at all times.
              </p>
              <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="w-[85%] h-full bg-emerald-500" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest mt-4 text-emerald-500/60">System Resilience: 85%</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}