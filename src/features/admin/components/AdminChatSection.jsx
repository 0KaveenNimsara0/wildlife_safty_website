import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
import { 
  MessageSquare, 
  Search, 
  User,
  Clock,
  Shield,
  Loader2,
  ChevronDown
} from 'lucide-react';
import MessageBubble from '../../chat/components/MessageBubble';
import ChatInput from '../../chat/components/ChatInput';
import { formatDate } from '../../../utils/formatters';

export default function AdminChatSection() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [convLoading, setConvLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('user');
  
  const messagesEndRef = useRef(null);
  const pollingInterval = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastMessagesLengthRef = useRef(0);
  const lastMessageIdRef = useRef(null);

  const adminToken = localStorage.getItem('adminToken');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchConversations();
    
    pollingInterval.current = setInterval(() => {
      fetchConversations(true);
      if (currentConversation?._id) {
        fetchMessages(currentConversation._id, true);
      }
    }, 2000);

    return () => {
      if (pollingInterval.current) clearInterval(pollingInterval.current);
    };
  }, [currentConversation?._id]);

  // Handle direct navigation from User Management
  useEffect(() => {
    if (targetUserId && conversations.length > 0 && !currentConversation) {
      const conv = conversations.find(c => (c.user?._id === targetUserId || c.user?.uid === targetUserId));
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [conversations, targetUserId]);

  useEffect(() => {
    if (messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        const latestMsgId = messages.length > 0 ? messages[messages.length - 1]._id : null;
        
        // Only scroll if we have more messages than before OR the last message ID is different
        if (messages.length > 0 && latestMsgId !== lastMessageIdRef.current) {
            if (isNearBottom || lastMessagesLengthRef.current === 0) {
                scrollToBottom();
                setNewMessagesCount(0);
            } else if (lastMessagesLengthRef.current > 0) {
                setNewMessagesCount(prev => prev + (messages.length - lastMessagesLengthRef.current));
            }
        }
        
        lastMessagesLengthRef.current = messages.length;
        lastMessageIdRef.current = latestMsgId;
    }
  }, [messages]);

  const fetchConversations = async (silent = false) => {
    try {
      if (!silent) setConvLoading(true);
      const response = await fetch(`${BASE_URL}/admin/chat/conversations/users`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      if (!silent) setConvLoading(false);
    }
  };

  const fetchMessages = async (convId, silent = false) => {
    if (!convId) return;
    try {
      const response = await fetch(`${BASE_URL}/admin/chat/messages/user/${convId}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSelectConversation = (conv) => {
    setCurrentConversation(conv);
    setMessages([]);
    lastMessagesLengthRef.current = 0;
    setNewMessagesCount(0);
    fetchMessages(conv._id);
  };

  const onSendMessage = async (messageText) => {
    if (!messageText.trim() || !currentConversation) return;

    const userId = currentConversation.user?._id || currentConversation.user?.uid;

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/admin/chat/send/user/${userId}`, {
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
        fetchConversations(true);
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-220px)] flex gap-6 animate-fade-in">
      <div className="w-80 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
           <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-slate-900">
              <MessageSquare size={18} className="text-emerald-500" />
              Civilian <span className="text-emerald-500">Inbound</span>
           </h2>
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search nodes..." 
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
                <span className="text-[9px] font-black uppercase tracking-widest">Scanning Network...</span>
             </div>
           ) : filteredConversations.length === 0 ? (
             <div className="text-center py-10 opacity-40">
                <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">No active signals</p>
             </div>
           ) : (
             filteredConversations.map((conv) => (
               <button
                 key={conv._id}
                 onClick={() => handleSelectConversation(conv)}
                 className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${
                   currentConversation?._id === conv._id 
                     ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                     : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                 }`}
               >
                 <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xs overflow-hidden">
                       {conv.user?.photoURL ? (
                         <img 
                           src={conv.user.photoURL.startsWith('http') ? conv.user.photoURL : `${IMAGE_BASE_URL}${conv.user.photoURL}`} 
                           alt="" 
                           className="w-full h-full object-cover" 
                         />
                       ) : (
                         conv.user?.name?.charAt(0).toUpperCase() || <User size={16} />
                       )}
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-white">
                         {conv.unreadCount}
                      </div>
                    )}
                 </div>
                 <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                       <h3 className="text-xs font-black text-slate-900 tracking-tight truncate">
                          {conv.user?.name || conv.user?.email?.split('@')[0]}
                       </h3>
                       <span className="text-[8px] font-bold text-slate-400 uppercase">
                          {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                       </span>
                    </div>
                    <p className={`text-[10px] truncate ${conv.unreadCount > 0 ? 'font-black text-slate-600' : 'text-slate-400 italic'}`}>
                       {conv.lastMessage?.message || 'Initiating link...'}
                    </p>
                 </div>
               </button>
             ))
           )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        {currentConversation ? (
          <>
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md z-10 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20 overflow-hidden">
                     {currentConversation.user?.photoURL ? (
                       <img 
                         src={currentConversation.user.photoURL.startsWith('http') ? currentConversation.user.photoURL : `${IMAGE_BASE_URL}${currentConversation.user.photoURL}`} 
                         alt="" 
                         className="w-full h-full object-cover" 
                       />
                     ) : (
                       currentConversation.user?.name?.charAt(0).toUpperCase() || <User size={18} />
                     )}
                  </div>
                  <div>
                     <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none mb-1.5">{currentConversation.user?.name || currentConversation.user?.email}</h3>
                     <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Secure Protocol Active</span>
                     </div>
                  </div>
               </div>
               <div className="hidden md:flex flex-col items-end">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Terminal</p>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight tracking-widest text-emerald-600">Admin_Root_Link</p>
               </div>
            </div>

            <div 
              className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6 bg-slate-50/30"
              ref={messagesContainerRef}
            >
               {messages.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full opacity-40">
                    <MessageSquare size={32} className="text-slate-300 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Awaiting Signal Synchronization</p>
                 </div>
               ) : (
                 messages.map((msg, i) => {
                   const isMe = msg.senderType === 'admin';
                   const showDate = i === 0 || formatDate(msg.createdAt) !== formatDate(messages[i - 1].createdAt);
                   
                   return (
                     <div key={msg._id || i}>
                        {showDate && (
                          <div className="flex items-center justify-center my-8">
                             <div className="h-px bg-slate-200 flex-1" />
                             <span className="px-4 py-1.5 rounded-full border border-slate-100 bg-white text-[9px] font-black uppercase tracking-widest text-slate-400 mx-4">
                                {formatDate(msg.createdAt)}
                             </span>
                             <div className="h-px bg-slate-200 flex-1" />
                          </div>
                        )}
                        <MessageBubble message={msg} isMe={isMe} />
                     </div>
                   );
                 })
               )}
               <div ref={messagesEndRef} />
            </div>

            {newMessagesCount > 0 && (
                <button 
                  onClick={scrollToBottom}
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl animate-bounce flex items-center gap-2 z-20"
                >
                   <ChevronDown size={14} />
                   {newMessagesCount} New Transmissions
                </button>
            )}

            <ChatInput 
              onSendMessage={onSendMessage} 
              loading={loading} 
              placeholder="Transmit response directive..." 
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />
             
             <div className="relative z-10">
                <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl flex items-center justify-center mb-8 border border-slate-100 shadow-emerald-500/5">
                   <Shield size={48} className="text-emerald-500 opacity-20" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-4">Command Post Standby</h3>
                <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-[0.15em]">
                   Select a civilian node from the network feed to establish a secure communication uplink.
                </p>
                
                <div className="mt-12 inline-flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-100 text-slate-400 shadow-sm">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <span className="text-[9px] font-black uppercase tracking-widest">System Protocols Active</span>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
