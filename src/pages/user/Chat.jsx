import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/useAuth';
import { Link } from 'react-router-dom';
import MedicalOfficerSelector from '../../features/chat/components/MedicalOfficerSelector';
import ChatInterface from '../../features/chat/components/ChatInterface';
import { Shield, MessageCircle, Users, Activity, ChevronRight, XCircle, Search } from 'lucide-react';
import api from '../../services/api';
import { IMAGE_BASE_URL , imageUrl } from '../../config/constants';

const UserChatPage = () => {
  const { activeUser: currentUser } = useAuth();
  const [selectedMedicalOfficer, setSelectedMedicalOfficer] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const activeConversationRef = useRef(null);
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
        if (activeConversationRef.current !== conversationId) return;
        setMessages(prev => [...response.data.messages, ...prev.filter(m => String(m._id).startsWith("temp-"))]);
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
        if (!currentConversation && response.data.message.conversationId) {
          activeConversationRef.current = response.data.message.conversationId;
          setCurrentConversation({ _id: response.data.message.conversationId, medicalOfficer: selectedMedicalOfficer });
        }
        fetchConversations();
      } else {
        throw new Error(response.data.message || 'Transmission failed');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Message was not confirmed. Your draft is preserved; check the conversation before retrying.');
      setMessages(prev => prev.filter(msg => msg._id !== optimisticMessage._id));
      return false;
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
      activeConversationRef.current = null;
      setCurrentConversation(null);
      setMessages([]);
    }
  };

  const handleConversationSelect = (conversation) => {
    activeConversationRef.current = conversation._id;
    setMessages([]);
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
        if (currentConversation && document.visibilityState === "visible") {
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
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full relative group">
          {/* Background Decorative Blur */}
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative glass p-10 rounded-2xl shadow-2xl border-white/40 ring-1 ring-slate-900/5 text-center space-y-8">
            <div className="mx-auto w-24 h-24 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping opacity-20" />
              <div className="relative bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center text-emerald-600 shadow-inner">
                <Shield size={40} />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
                Sign in to <span className="text-emerald-600">chat</span>
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Log in to establish a secure connection with our medical professionals and receive real-time species guidance.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <Link 
                to="/login"
                className="btn-primary w-full py-4 flex items-center justify-center gap-3 group"
              >
                <span>Sign in</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Your conversations, in one place
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex flex-1 min-h-0 flex-col">
        <div className="overflow-hidden bg-white flex flex-col flex-1 min-h-0">
          <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
            <aside className={`w-full md:w-80 shrink-0 min-h-0 border-r border-slate-200 bg-white ${selectedMedicalOfficer ? "hidden md:flex" : "flex"} flex-col`}>
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="px-5 pt-5 pb-2"><h1 className="text-xl font-semibold text-slate-900">Messages</h1><p className="mt-1 text-sm text-slate-500">Your medical support conversations</p></div>
                <MedicalOfficerSelector
                  onSelect={handleMedicalOfficerSelect}
                  selectedMedicalOfficer={selectedMedicalOfficer}
                />

                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Your conversations</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-50">
                  {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                      <button
                        type="button"
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`w-full text-left p-4 cursor-pointer transition-all duration-300 group ${
                          currentConversation?._id === conversation._id 
                            ? 'bg-white border-l-4 border-emerald-500 shadow-inner' 
                            : 'hover:bg-white/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors overflow-hidden">
                            {conversation.medicalOfficer?.photoURL ? (
                              <img
                                src={conversation.medicalOfficer.photoURL.startsWith('http') ? conversation.medicalOfficer.photoURL : imageUrl(conversation.medicalOfficer.photoURL)}
                                alt={conversation.medicalOfficer.name?.charAt(0) || 'M'}
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerText = conversation.medicalOfficer?.name?.charAt(0) || 'M'; }}
                              />
                            ) : (
                              conversation.medicalOfficer?.name?.charAt(0) || 'M'
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate tracking-tight">
                              {conversation.medicalOfficer?.name || 'Medical Officer'}
                            </p>
                            <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                              {conversation.lastMessage?.message || 'Start a conversation'}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {conversation.unreadCount > 0 && (
                              <span className="w-5 h-5 bg-emerald-600 text-white text-[10px] font-semibold rounded-lg flex items-center justify-center shadow-lg shadow-emerald-200">
                                {conversation.unreadCount}
                              </span>
                            )}
                            <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <Search size={32} className="mx-auto text-slate-200" />
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">No conversations yet</p>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <main className={`flex-1 min-w-0 min-h-0 ${selectedMedicalOfficer ? 'flex' : 'hidden md:flex'} flex-col`}>
              {selectedMedicalOfficer && <button onClick={()=>setSelectedMedicalOfficer(null)} className="md:hidden shrink-0 border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-emerald-700">← All conversations</button>}
              {selectedMedicalOfficer ? (
                <ChatInterface
                  key={selectedMedicalOfficer._id}
                  participant={selectedMedicalOfficer}
                  messages={messages}
                  onSendMessage={sendMessage}
                  loading={loading}
                  error={error}
                  onClearError={() => setError(null)}
                  currentSenderId={currentUser?.uid}
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                  <div className="rounded-2xl bg-emerald-100 p-5 text-emerald-700 mb-5"><MessageCircle size={32}/></div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">Who would you like to talk to?</h3>
                  <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                    Choose a medical officer to start a conversation, or open a previous chat. Your messages will appear here.
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
