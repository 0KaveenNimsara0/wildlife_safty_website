import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config/constants';
import { 
  MessageSquare, 
  Search, 
  MoreVertical,
  Activity,
  Shield,
  AlertCircle,
  Loader2
} from 'lucide-react';
import MessageBubble from '../../features/chat/components/MessageBubble';
import ChatInput from '../../features/chat/components/ChatInput';

export default function AdminMedicalChat() {
  const { officerId: paramOfficerId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [currentOfficer, setCurrentOfficer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [msgLoading, setMsgLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);

  const adminToken = localStorage.getItem('adminToken');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    fetchConversations();
    
    if (paramOfficerId) {
      fetchOfficerDetails(paramOfficerId);
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [paramOfficerId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (currentOfficer && currentOfficer.conversationId) {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
      
      pollingInterval.current = setInterval(() => {
        fetchMessages(currentOfficer.conversationId);
      }, 2000);
    }

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [currentOfficer]);

  const fetchOfficerDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/users/medical-officers`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        const officer = data.medicalOfficers.find(o => o._id === id);
        if (officer) {
          handleSelectOfficer(officer);
        }
      }
    } catch (err) {
      console.error('Error fetching officer details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      setConvLoading(true);
      const response = await fetch(`${BASE_URL}/admin/chat/conversations/medical-officers`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setConvLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/chat/messages/medical-officer/${convId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('[AdminChat] Signal Acquisition Failure:', err);
    }
  };

  const handleSelectOfficer = (officer, convId = null) => {
    setCurrentOfficer({
      ...officer,
      conversationId: convId || conversations.find(c => c.medicalOfficer?._id === officer._id)?._id
    });

    if (convId) {
      fetchMessages(convId);
    } else {
      const existing = conversations.find(c => c.medicalOfficer?._id === officer._id);
      if (existing) {
        fetchMessages(existing._id);
      } else {
        setMessages([]);
      }
    }
  };

  const onSendMessage = async (messageText) => {
    if (!messageText.trim() || !currentOfficer) return;

    const officerId = currentOfficer._id;

    try {
      const response = await fetch(`${BASE_URL}/admin/chat/send/medical-officer/${officerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        
        if (!currentOfficer.conversationId && data.message.conversationId) {
          setCurrentOfficer(prev => ({
             ...prev,
             conversationId: data.message.conversationId
          }));
        }
        fetchConversations();
      } else {
        alert('Failed to send message: ' + (data.message || 'Unknown protocol error'));
      }
    } catch (err) {
      alert('Failed to send message');
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.medicalOfficer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
      <div className="w-80 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
           <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              Tactical <span className="text-emerald-500">Comms</span>
           </h2>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Scan frequencies..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-100 focus:border-emerald-500 focus:outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-slate-300 transition-all font-sans" 
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
           {convLoading ? (
             <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <Loader2 size={24} className="animate-spin text-emerald-600 mb-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">Syncing Nodes...</span>
             </div>
           ) : filteredConversations.length === 0 ? (
             <div className="text-center py-10 opacity-40">
                <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">No signals detected</p>
             </div>
           ) : (
             filteredConversations.map((conv) => (
               <button
                 key={conv._id}
                 onClick={() => handleSelectOfficer(conv.medicalOfficer, conv._id)}
                 className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                   currentOfficer?._id === conv.medicalOfficer?._id 
                     ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                     : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                 }`}
               >
                 <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs shadow-md">
                       {conv.medicalOfficer?.name?.charAt(0).toUpperCase()}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white">
                         {conv.unreadCount}
                      </div>
                    )}
                 </div>
                 <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                          {conv.medicalOfficer?.name}
                       </h3>
                       <span className="text-[8px] font-bold text-slate-400 uppercase">
                          {formatTime(conv.lastMessage.createdAt)}
                       </span>
                    </div>
                    <p className={`text-[10px] truncate ${conv.unreadCount > 0 ? 'font-black text-slate-600' : 'font-medium text-slate-400 italic'}`}>
                       {conv.lastMessage.message}
                    </p>
                 </div>
               </button>
             ))
           )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        {currentOfficer ? (
          <>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md z-10">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20">
                     {currentOfficer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">{currentOfficer.name}</h3>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tactical Uplink Active</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 ml-2 border-l border-slate-200 pr-2">
                           {currentOfficer.specialization?.replace('_', ' ')}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <div className="flex flex-col items-end mr-4">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Authority</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Level 4 Admin</p>
                  </div>
                  <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors">
                     <MoreVertical size={20} />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 bg-slate-50/30">
               {msgLoading ? (
                 <div className="flex items-center justify-center h-full opacity-30">
                    <Loader2 size={32} className="animate-spin text-emerald-600" />
                 </div>
               ) : messages.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-40">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                       <MessageSquare size={32} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Initiate Communication Protocol</p>
                 </div>
               ) : (
                 messages.map((msg, i) => {
                   const isMe = msg.senderType === 'admin';
                   return (
                     <MessageBubble 
                       key={msg._id || i}
                       message={msg} 
                       isMe={isMe} 
                     />
                   );
                 })
               )}
               <div ref={messagesEndRef} />
            </div>

            <ChatInput 
              onSendMessage={onSendMessage} 
              loading={loading} 
              placeholder="Transmit operational directive..." 
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center">
             <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl flex items-center justify-center mb-8 animate-pulse border border-slate-100">
                <Shield size={48} className="text-emerald-500 opacity-20" />
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-4">Secure Link Required</h3>
             <p className="text-xs font-medium text-slate-400 max-w-sm leading-relaxed uppercase tracking-widest">
                Select a medical operative from the tactical feed to establish an encrypted end-to-end communication channel.
             </p>
             <div className="mt-12 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4 text-left max-w-sm">
                <AlertCircle className="text-amber-500 shrink-0" size={20} />
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-1">Operational Protocol</p>
                   <p className="text-[9px] font-bold text-amber-600 leading-normal uppercase">All administrative communications are logged and monitored for quality and tactical assurance.</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
