import Avatar from '../../../components/ui/Avatar';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, MessageSquare, Activity } from 'lucide-react';
import ChatInterface from '../../chat/components/ChatInterface';
import { BASE_URL, IMAGE_BASE_URL , imageUrl } from '../../../config/constants';

const ConsultationsSection = () => {
  const [medicalOfficerId, setMedicalOfficerId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); 
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const selectedConversationRef = useRef(null);
  selectedConversationRef.current = currentConversation?._id;
  useEffect(() => {
    const token = localStorage.getItem('medicalOfficerToken');
    if (token) {
      setMedicalOfficerId(token);
    } else {
      setError('Medical officer not logged in');
    }
  }, []);

  const fetchConversations = useCallback(async (id, silent = false) => {
    try {
      const response = await fetch(`${BASE_URL}/medical-officer/chat/conversations`, {
        headers: {
          'Authorization': `Bearer ${id}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      } else {
        if (!silent) setError(data.message || 'Failed to load conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      if (!silent) setError('Failed to load conversations');
    }
  }, []);

  const fetchAdmins = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/medical-officer/chat/admins`, {
        headers: {
          'Authorization': `Bearer ${medicalOfficerId}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  }, [medicalOfficerId]);

  const fetchMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;
    try {
      const response = await fetch(`${BASE_URL}/medical-officer/chat/messages/${conversationId}`, {
        headers: {
          'Authorization': `Bearer ${medicalOfficerId}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        if (selectedConversationRef.current !== conversationId) return;
        setMessages(data.messages);
        window.dispatchEvent(new Event("chat-messages-read"));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [medicalOfficerId]);

  useEffect(() => {
    let messagesInterval = null;
    let conversationsInterval = null;

    if (medicalOfficerId) {
      if (activeTab === 'users') {
        fetchConversations(medicalOfficerId);
      } else {
        fetchAdmins();
        fetchConversations(medicalOfficerId);
      }

      conversationsInterval = setInterval(() => {
        fetchConversations(medicalOfficerId, true);
      }, 2000);

      if (currentConversation?._id) {
        messagesInterval = setInterval(() => {
          fetchMessages(currentConversation._id, true);
        }, 2000);
      }
    }

    return () => {
      if (messagesInterval) clearInterval(messagesInterval);
      if (conversationsInterval) clearInterval(conversationsInterval);
    };
  }, [medicalOfficerId, currentConversation?._id, activeTab, fetchConversations, fetchAdmins, fetchMessages]);

  const onSendMessage = async (messageText) => {
    if (!messageText.trim() || !currentConversation) return false;

    try {
      const receiverId = currentConversation.user?.uid || currentConversation.user?._id || currentConversation.admin?._id;
      const receiverType = currentConversation.admin ? 'admin' : 'user';

      if (!receiverId) return false;

      setLoading(true);
      const response = await fetch(`${BASE_URL}/medical-officer/chat/send/${receiverId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${medicalOfficerId}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText.trim(),
          receiverType: receiverType
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        fetchConversations(medicalOfficerId);
      } else {
        setError(data.message || 'Failed to send message');
        return false;
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStartAdminChat = (admin) => {
    const existing = conversations.find(c => c.admin?._id === admin._id);
    if (existing) {
      handleConversationSelect(existing);
    } else {
      setCurrentConversation({
        _id: null,
        admin: admin,
        isNew: true
      });
      setMessages([]);
    }
  };

  const handleConversationSelect = (conversation) => {
    setCurrentConversation(conversation);
    setMessages([]); 
    if (conversation._id) {
      fetchMessages(conversation._id);
    } else {
      setMessages([]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col h-[calc(100vh-220px)] animate-fade-in">
      <div className="flex h-full">
            <div className="w-1/3 border-r border-slate-50 flex flex-col bg-slate-50/30">
              <div className="p-6 border-b border-slate-50 bg-white/50 backdrop-blur-md">
                 <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 shadow-inner">
                    <button 
                      onClick={() => setActiveTab('users')}
                      className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-normal rounded-xl transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Users
                    </button>
                    <button 
                      onClick={() => setActiveTab('admins')}
                      className={`flex-1 py-3 text-[10px] font-semibold uppercase tracking-normal rounded-xl transition-all ${activeTab === 'admins' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Admin Chat
                    </button>
                 </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-normal ml-1">
                     {activeTab === 'users' ? 'All Conversations' : 'Support Channels'}
                  </h3>
                  <button
                    onClick={() => fetchConversations(medicalOfficerId)}
                    className="text-slate-400 hover:text-emerald-600 p-2 rounded-xl hover:bg-emerald-50 transition-colors active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                  {activeTab === 'users' ? (
                    conversations.filter(c => c.user).map((conversation) => (
                      <button
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`w-full text-left p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                          currentConversation?._id === conversation._id
                            ? 'bg-white border-emerald-100 shadow-lg shadow-emerald-500/5'
                            : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-100'
                        }`}
                      >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center text-[10px] font-semibold text-slate-400">
                               {conversation.user?.photoURL ? (
                                 <Avatar src={conversation.user.photoURL.startsWith('/uploads') ? imageUrl(conversation.user.photoURL) : conversation.user.photoURL} name="User" />
                               ) : (
                                 conversation.user?.displayName?.charAt(0).toUpperCase() || 'U'
                               )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate text-xs tracking-tight">
                                 {conversation.user?.displayName || conversation.user?.email?.split('@')[0] || 'Field Node'}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-1 italic font-medium">
                                 {conversation.lastMessage?.message || 'Start typing...'}
                              </p>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 w-5 h-5 flex items-center justify-center bg-emerald-500 text-white text-[9px] font-semibold rounded-full shadow-lg shadow-emerald-500/20">
                               {conversation.unreadCount}
                            </span>
                          )}
                      </button>
                    ))
                  ) : (
                    <div className="space-y-2">
                       {admins.map(admin => (
                         <button 
                           key={admin._id}
                           onClick={() => handleStartAdminChat(admin)}
                           className={`w-full text-left p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${currentConversation?.admin?._id === admin._id ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20 border-emerald-500' : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-100 text-slate-900 font-semibold'}`}
                         >
                             <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold shadow-inner overflow-hidden flex-shrink-0 ${currentConversation?.admin?._id === admin._id ? 'bg-white text-emerald-600' : 'bg-slate-900 text-white'}`}>
                                   {admin.photoURL ? (
                                      <Avatar src={admin.photoURL.startsWith('/uploads') ? imageUrl(admin.photoURL) : admin.photoURL} name="Admin" />
                                   ) : admin.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                   <p className="text-xs font-semibold tracking-tight truncate">{admin.name}</p>
                                   <p className={`text-[9px] font-bold uppercase tracking-normal ${currentConversation?.admin?._id === admin._id ? 'text-emerald-200' : 'text-slate-400'}`}>Official Support</p>
                                 </div>
                             </div>
                         </button>
                       ))}
                    </div>
                  )}
                  {activeTab === 'users' && conversations.filter(c => c.user).length === 0 && (
                    <div className="p-6 text-center opacity-20 flex flex-col items-center">
                       <MessageSquare size={48} className="text-slate-400 mb-4" />
                       <p className="text-[10px] font-semibold uppercase tracking-normal text-slate-500">No active sessions</p>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-white">
              {currentConversation ? (
                <ChatInterface
                  key={currentConversation._id || currentConversation.admin?._id || currentConversation.user?.uid}
                  participant={{
                    ...(currentConversation.admin || currentConversation.user),
                    name: currentConversation.admin?.name || currentConversation.user?.displayName || currentConversation.user?.email || 'User'
                  }}
                  messages={messages}
                  onSendMessage={onSendMessage}
                  loading={loading}
                  error={error}
                  onClearError={() => setError(null)}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/20 p-6 text-center overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                   <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />
                   
                   <div className="relative z-10">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-5 border border-slate-100 animate-pulse">
                         <Activity size={54} className="text-emerald-600 opacity-20" />
                      </div>
                       <h3 className="text-xl font-semibold uppercase tracking-tight text-slate-800 mb-4">Select a Conversation</h3>
                       <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-normal">
                          Choose a user or support staff member from the list to begin messaging.
                       </p>
                      
                      <div className="mt-12 group">
                         <div className="inline-flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100 text-slate-500 shadow-sm opacity-60">
                            <div className="w-2 h-2 rounded-full bg-slate-200 animate-ping" />
                             <span className="text-[10px] font-semibold uppercase tracking-normal">Status: Ready to Message</span>
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
        </div>
      </div>
  );
};

export default ConsultationsSection;
