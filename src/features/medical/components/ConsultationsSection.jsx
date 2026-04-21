import React, { useState, useEffect, useRef } from 'react';
import { Loader2, MessageSquare, ChevronDown, Activity } from 'lucide-react';
import MessageBubble from '../../chat/components/MessageBubble';
import ChatInput from '../../chat/components/ChatInput';
import { formatDate } from '../../../utils/formatters';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';

const ConsultationsSection = () => {
  const [medicalOfficerId, setMedicalOfficerId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); 
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  
  const messagesContainerRef = useRef(null);
  const lastParticipantRef = useRef(null);
  const lastMessagesLengthRef = useRef(0);

  useEffect(() => {
    const token = localStorage.getItem('medicalOfficerToken');
    if (token) {
      setMedicalOfficerId(token);
    } else {
      setError('Medical officer not logged in');
    }
  }, []);

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
  }, [medicalOfficerId, currentConversation?._id, activeTab]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      if (isAtBottom && newMessagesCount > 0) {
        setNewMessagesCount(0);
      }
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      const isNewChannel = lastParticipantRef.current !== (currentConversation?.user?._id || currentConversation?.admin?._id);
      
      const hasNewMessages = messages.length > lastMessagesLengthRef.current;

      if (isNewChannel) {
        container.scrollTop = container.scrollHeight;
        setNewMessagesCount(0);
      } else if (hasNewMessages) {
        if (isNearBottom) {
          container.scrollTop = container.scrollHeight;
          setNewMessagesCount(0);
        } else {
          setNewMessagesCount(prev => prev + (messages.length - lastMessagesLengthRef.current));
        }
      }

      lastMessagesLengthRef.current = messages.length;
      if (currentConversation?._id || currentConversation?.user?._id || currentConversation?.admin?._id) {
        lastParticipantRef.current = currentConversation.user?._id || currentConversation.admin?._id;
      }
    }
  }, [messages, currentConversation?._id, currentConversation?.user?._id, currentConversation?.admin?._id]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      setNewMessagesCount(0);
    }
  };

  const fetchConversations = async (id, silent = false) => {
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
  };

  const fetchAdmins = async () => {
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
  };

  const fetchMessages = async (conversationId, silent = false) => {
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
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const onSendMessage = async (messageText) => {
    if (!messageText.trim() || !currentConversation) return;

    try {
      const receiverId = currentConversation.user?.uid || currentConversation.user?._id || currentConversation.admin?._id;
      const receiverType = currentConversation.admin ? 'admin' : 'user';

      if (!receiverId) return;

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
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
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
    <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col h-[calc(100vh-220px)] animate-fade-in">
      <div className="flex h-full">
            <div className="w-1/3 border-r border-slate-50 flex flex-col bg-slate-50/30">
              <div className="p-6 border-b border-slate-50 bg-white/50 backdrop-blur-md">
                 <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6 shadow-inner">
                    <button 
                      onClick={() => setActiveTab('users')}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'users' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Users
                    </button>
                    <button 
                      onClick={() => setActiveTab('admins')}
                      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'admins' ? 'bg-white text-slate-900 shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       Admin Chat
                    </button>
                 </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                     {activeTab === 'users' ? 'All Conversations' : 'Support Channels'}
                  </h3>
                  <button
                    onClick={() => fetchConversations(medicalOfficerId)}
                    className="text-slate-400 hover:text-indigo-600 p-2 rounded-xl hover:bg-indigo-50 transition-colors active:scale-95"
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
                            ? 'bg-white border-indigo-100 shadow-lg shadow-indigo-500/5'
                            : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-100'
                        }`}
                      >
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center text-[10px] font-black text-slate-400">
                               {conversation.user?.photoURL ? (
                                 <img src={conversation.user.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${conversation.user.photoURL}` : conversation.user.photoURL} alt="User" className="w-full h-full object-cover" />
                               ) : (
                                 conversation.user?.displayName?.charAt(0).toUpperCase() || 'U'
                               )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-slate-900 truncate text-xs uppercase tracking-tight">
                                 {conversation.user?.displayName || conversation.user?.email?.split('@')[0] || 'Field Node'}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate mt-1 italic font-medium">
                                 {conversation.lastMessage?.message || 'Start typing...'}
                              </p>
                            </div>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 w-5 h-5 flex items-center justify-center bg-indigo-500 text-white text-[9px] font-black rounded-full shadow-lg shadow-indigo-500/20">
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
                           className={`w-full text-left p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${currentConversation?.admin?._id === admin._id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 border-indigo-500' : 'bg-transparent border-transparent hover:bg-white/50 hover:border-slate-100 text-slate-900 font-black'}`}
                         >
                             <div className="flex items-center gap-3">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-inner overflow-hidden flex-shrink-0 ${currentConversation?.admin?._id === admin._id ? 'bg-white text-indigo-600' : 'bg-slate-900 text-white'}`}>
                                   {admin.photoURL ? (
                                      <img src={admin.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${admin.photoURL}` : admin.photoURL} alt="Admin" className="w-full h-full object-cover" />
                                   ) : admin.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                   <p className="text-xs font-black uppercase tracking-tight truncate">{admin.name}</p>
                                   <p className={`text-[9px] font-bold uppercase tracking-widest ${currentConversation?.admin?._id === admin._id ? 'text-indigo-200' : 'text-slate-400'}`}>Official Support</p>
                                 </div>
                             </div>
                         </button>
                       ))}
                    </div>
                  )}
                  {activeTab === 'users' && conversations.filter(c => c.user).length === 0 && (
                    <div className="p-12 text-center opacity-20 flex flex-col items-center">
                       <MessageSquare size={48} className="text-slate-400 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No active sessions</p>
                    </div>
                  )}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
              {currentConversation ? (
                <>
                  <div className="px-8 py-6 bg-white border-b border-slate-50 flex items-center justify-between shadow-sm relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-xl overflow-hidden ${currentConversation.admin ? 'bg-slate-900 shadow-slate-900/10' : 'bg-indigo-600 shadow-indigo-500/10'}`}>
                           {currentConversation.admin ? (
                              currentConversation.admin.photoURL ? (
                                <img src={currentConversation.admin.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${currentConversation.admin.photoURL}` : currentConversation.admin.photoURL} alt="Admin" className="w-full h-full object-cover" />
                              ) : currentConversation.admin.name?.charAt(0).toUpperCase()
                           ) : (
                              currentConversation.user?.photoURL ? (
                                <img src={currentConversation.user.photoURL?.startsWith('/uploads') ? `${IMAGE_BASE_URL}${currentConversation.user.photoURL}` : currentConversation.user.photoURL} alt="User" className="w-full h-full object-cover" />
                              ) : currentConversation.user?.displayName?.charAt(0).toUpperCase() || 'U'
                           )}
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none mb-1.5">
                             {currentConversation.user?.displayName || currentConversation.user?.email || currentConversation.admin?.name || 'Authorized User'}
                          </h3>
                          <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                               <span className={`text-[10px] font-black uppercase tracking-widest ${currentConversation.admin ? 'text-slate-500 underline decoration-slate-200 underline-offset-4' : 'text-indigo-500'}`}>
                                  {currentConversation.admin ? 'Official System Support' : 'Support Conversation'}
                               </span>
                          </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="hidden lg:flex flex-col items-end mr-4">
                           <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Security</p>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">E2E Encrypted</p>
                       </div>
                       <button className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-all">
                          <svg size={20} fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                       </button>
                    </div>
                  </div>

                  <div className="flex-1 relative flex flex-col bg-slate-50/20 overflow-hidden">
                    {newMessagesCount > 0 && (
                      <button 
                        onClick={scrollToBottom}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/30 flex items-center gap-2 z-20 animate-bounce hover:bg-indigo-700 transition-all active:scale-95"
                      >
                          <ChevronDown size={14} />
                          {newMessagesCount} New Messages Available
                       </button>
                    )}

                    <div 
                      className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar"
                      ref={messagesContainerRef}
                      onScroll={handleScroll}
                    >
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                        <div className="w-20 h-20 rounded-[32px] bg-slate-100 flex items-center justify-center mb-6">
                           <MessageSquare size={32} className="text-slate-300" />
                        </div>
                         <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Select a Contact</h3>
                         <p className="text-[10px] font-bold text-slate-400 max-w-[200px] uppercase tracking-widest leading-relaxed">Your encrypted message history will appear here.</p>
                       </div>
                    )}

                    {messages.map((message, index) => {
                      const isMedicalOfficer = message.senderType === 'medical_officer';
                      const showDate = index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                      return (
                        <div key={message._id || index} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {showDate && (
                            <div className="text-center my-8 flex items-center justify-center gap-4">
                               <div className="h-px bg-slate-100 flex-1" />
                               <span className="bg-white border border-slate-100 text-slate-400 text-[9px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest shadow-sm">
                                 {formatDate(message.createdAt)}
                               </span>
                               <div className="h-px bg-slate-100 flex-1" />
                            </div>
                          )}
                          <MessageBubble 
                            message={message} 
                            isMe={isMedicalOfficer} 
                            avatar={!isMedicalOfficer ? (
                              currentConversation.admin 
                                ? (currentConversation.admin.photoURL ? (currentConversation.admin.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${currentConversation.admin.photoURL}` : currentConversation.admin.photoURL) : null)
                                : (currentConversation.user?.photoURL ? (currentConversation.user.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${currentConversation.user.photoURL}` : currentConversation.user.photoURL) : null)
                            ) : null}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                  <div className="p-6 bg-white border-t border-slate-50 relative z-10">
                     <ChatInput 
                       onSendMessage={onSendMessage} 
                       loading={loading} 
                       placeholder="Type your message here..." 
                     />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/20 p-12 text-center overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full -mr-48 -mt-48 blur-3xl" />
                   <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full -ml-48 -mb-48 blur-3xl" />
                   
                   <div className="relative z-10">
                      <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl flex items-center justify-center mb-10 border border-slate-100 animate-pulse">
                         <Activity size={54} className="text-indigo-600 opacity-20" />
                      </div>
                       <h3 className="text-3xl font-black uppercase tracking-tight text-slate-800 mb-4">Select a Conversation</h3>
                       <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
                          Choose a user or support staff member from the list to begin messaging.
                       </p>
                      
                      <div className="mt-12 group">
                         <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-100 text-slate-500 shadow-sm opacity-60">
                            <div className="w-2 h-2 rounded-full bg-slate-200 animate-ping" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Status: Ready to Message</span>
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
