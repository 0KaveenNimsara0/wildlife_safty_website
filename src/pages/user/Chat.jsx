import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MedicalOfficerSelector from '../../features/chat/components/MedicalOfficerSelector';
import ChatInterface from '../../features/chat/components/ChatInterface';
import { Shield, MessageCircle, Users, Activity, ChevronRight, XCircle, Search } from 'lucide-react';
import api from '../../services/api';

const UserChatPage = () => {
  const { currentUser } = useAuth();
  const [selectedMedicalOfficer, setSelectedMedicalOfficer] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = async (silent = false) => {
    try {
      const response = await api.get('/user/chat/conversations');
      if (response.data.success) {
        // Logically clear unread count for current chat to avoid ghost badges during polling
        const syncedConversations = response.data.conversations.map(conv => ({
          ...conv,
          unreadCount: currentConversation?._id === conv._id ? 0 : conv.unreadCount
        }));
        setConversations(syncedConversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (!silent) setError('Failed to load conversations.');
    }
  };

  const fetchMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await api.get(`/user/chat/messages/${conversationId}`);
      if (response.data.success) {
        setMessages(response.data.messages);
        // Sync conversation list immediately to clear unread badges
        fetchConversations(true);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (!silent) setError('Failed to load messages.');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const sendMessage = async (messageText) => {
    if (!selectedMedicalOfficer || !messageText.trim()) return;

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      message: messageText,
      senderId: currentUser.uid,
      senderType: 'user',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await api.post(`/user/chat/send/${selectedMedicalOfficer._id}`, { message: messageText });

      if (response.data.success) {
        setMessages(prev => prev.map(msg => 
          msg._id === optimisticMessage._id ? response.data.message : msg
        ));
        fetchConversations();
      } else {
        throw new Error(response.data.message || 'Transmission failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Communication interrupted. Retrying...');
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
    }
  };

  const handleMedicalOfficerSelect = (medicalOfficer) => {
    const existingConversation = conversations.find(
      (conv) => conv.medicalOfficer?._id === medicalOfficer._id
    );

    if (existingConversation) {
      handleConversationSelect(existingConversation);
    } else {
      setSelectedMedicalOfficer(medicalOfficer);
      setCurrentConversation(null);
      setMessages([]);
    }
  };

  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
    setSelectedMedicalOfficer(conversation.medicalOfficer);
    fetchMessages(conversation._id);
  };

  useEffect(() => {
    let messagesInterval = null;
    let conversationsInterval = null;

    if (currentUser) {
      fetchConversations();

      conversationsInterval = setInterval(() => {
        fetchConversations(true);
      }, 5000);

      messagesInterval = setInterval(() => {
        if (currentConversation) {
          fetchMessages(currentConversation._id, true);
        }
      }, 3000);
    }

    return () => {
      if (messagesInterval) clearInterval(messagesInterval);
      if (conversationsInterval) clearInterval(conversationsInterval);
    };
  }, [currentUser, currentConversation]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to use the chat feature and connect with our medical professionals.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card-premium overflow-hidden bg-white/70 backdrop-blur-md border-slate-100 flex flex-col h-[85vh] shadow-2xl">
          <header className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                <MessageCircle size={24} />
              </div>
              <div>
                <h1 className="text-2xl text-white tracking-tight uppercase">Talk to <span className="text-emerald-400">Specialist</span></h1>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500/80">
                  <Shield size={12} />
                  <span>Secure Medical Uplink</span>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 relative z-10">
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Terminal Status</p>
                  <p className="text-xs font-bold text-emerald-400">ACTIVE CONNECTION</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                  <Activity size={18} className="text-emerald-500 animate-pulse" />
               </div>
            </div>
          </header>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <aside className="w-full md:w-[400px] border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                <MedicalOfficerSelector
                  onSelect={handleMedicalOfficerSelect}
                  selectedMedicalOfficer={selectedMedicalOfficer}
                />

                <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active Channels</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-50">
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <div
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-6 cursor-pointer transition-all duration-300 group ${
                          currentConversation?._id === conversation._id 
                            ? 'bg-white border-l-4 border-emerald-500 shadow-inner' 
                            : 'hover:bg-white/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                            {conversation.medicalOfficer?.name?.charAt(0) || 'M'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-black text-slate-900 truncate tracking-tight">
                              {conversation.medicalOfficer?.name || 'Medical Officer'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                              {conversation.lastMessage?.message || 'Initiate connection...'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {conversation.unreadCount > 0 && (
                              <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
                                {conversation.unreadCount}
                              </span>
                            )}
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center space-y-4 opacity-50">
                      <Search size={32} className="mx-auto text-slate-200" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No active channels</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <main className="flex-1 flex flex-col">
              {selectedMedicalOfficer ? (
                <ChatInterface
                  participant={selectedMedicalOfficer}
                  messages={messages}
                  onSendMessage={sendMessage}
                  loading={loading}
                  error={error}
                  onClearError={() => setError(null)}
                  currentSenderId={currentUser?.uid}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                  <div className="text-7xl text-green-300 mb-4 animate-bounce">💬</div>
                  <h3 className="text-2xl font-semibold text-gray-700 mb-2">Welcome to the Chat</h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a medical officer from the list on the left or select an existing conversation to continue your chat.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChatPage;
