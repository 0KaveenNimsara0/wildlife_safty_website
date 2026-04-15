import React, { useState, useEffect, useRef } from 'react';
import { Loader2, MessageSquare, ChevronDown } from 'lucide-react';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import { formatDate } from '../../utils/formatters';

const API_BASE_URL = 'http://localhost:5000/api';

const MedicalOfficerChatPage = () => {
  const [medicalOfficerId, setMedicalOfficerId] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'admins'
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  
  const messagesContainerRef = useRef(null);
  const lastParticipantRef = useRef(null);
  const lastMessagesLengthRef = useRef(0);

  // Get medical officer ID from localStorage
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

      // Poll conversations every 2 seconds (silent)
      conversationsInterval = setInterval(() => {
        fetchConversations(medicalOfficerId, true);
      }, 2000);

      // Poll messages for current conversation every 2 seconds (silent)
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

  // Handle Scroll to reset new message count
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      if (isAtBottom && newMessagesCount > 0) {
        setNewMessagesCount(0);
      }
    }
  };

  // Smart Scrolling Effect
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

  // Fetch conversations
  const fetchConversations = async (id, silent = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/conversations`, {
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

  // Fetch all admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/admins`, {
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

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId, silent = false) => {
    if (!conversationId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/messages/${conversationId}`, {
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

  // Send message
  const onSendMessage = async (messageText) => {
    if (!messageText.trim() || !currentConversation) return;

    try {
      const receiverId = currentConversation.user?.uid || currentConversation.user?._id || currentConversation.admin?._id;
      const receiverType = currentConversation.admin ? 'admin' : 'user';

      if (!receiverId) return;

      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/medical-officer/chat/send/${receiverId}`, {
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
    setMessages([]); // Clear immediately to prevent ghosting and stabilize scroll height
    if (conversation._id) {
      fetchMessages(conversation._id);
    } else {
      setMessages([]);
    }
  };

  if (!medicalOfficerId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to be logged in as a medical officer to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200 flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex h-full">
             {/* Sidebar */}
            <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-4 border-b border-slate-100 bg-white">
                 <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
                    <button 
                      onClick={() => setActiveTab('users')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                       Users
                    </button>
                    <button 
                      onClick={() => setActiveTab('admins')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'admins' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                       Administration
                    </button>
                 </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     {activeTab === 'users' ? 'Active Inquiries' : 'Support Channels'}
                  </h3>
                  <button
                    onClick={() => fetchConversations(medicalOfficerId)}
                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-green-100">
                  {activeTab === 'users' ? (
                    conversations.filter(c => c.user).map((conversation) => (
                      <div
                        key={conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                        className={`p-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50 ${
                          currentConversation?._id === conversation._id
                            ? 'bg-indigo-50/50 border-r-4 border-indigo-600'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate text-sm">
                              {conversation.user?.displayName || conversation.user?.email || 'User'}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate mt-1">
                              {conversation.lastMessage?.message || 'No messages yet'}
                            </p>
                          </div>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-green-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 space-y-1">
                       <p className="px-3 py-2 text-[10px] font-black text-green-600 uppercase tracking-widest">Available Authorities</p>
                       {admins.map(admin => (
                         <div 
                           key={admin._id}
                           onClick={() => handleStartAdminChat(admin)}
                           className={`p-4 rounded-xl cursor-pointer transition-all ${currentConversation?.admin?._id === admin._id ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-green-100 text-green-900'}`}
                         >
                            <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${currentConversation?.admin?._id === admin._id ? 'bg-white text-green-600' : 'bg-green-600 text-white'}`}>
                                  {admin.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-sm font-bold truncate">{admin.name}</p>
                                  <p className={`text-[9px] uppercase tracking-widest ${currentConversation?.admin?._id === admin._id ? 'text-green-100' : 'text-green-500'}`}>Admin Portal</p>
                                </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  )}
                  {activeTab === 'users' && conversations.filter(c => c.user).length === 0 && (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-2 opacity-20">💬</div>
                      <p className="text-xs text-green-600 font-medium">No active user sessions</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-white">
              {currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentConversation.admin ? 'bg-slate-900' : 'bg-green-500'}`}>
                          <span className="text-white font-semibold text-sm">
                            {currentConversation.user?.displayName?.charAt(0).toUpperCase() || currentConversation.admin?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {currentConversation.user?.displayName || currentConversation.user?.email || currentConversation.admin?.name || 'User'}
                        </h3>
                        <p className={`text-sm font-medium ${currentConversation.admin ? 'text-slate-500' : 'text-green-500'}`}>
                            {currentConversation.admin ? 'Administrative Node' : 'Field Inquiry'}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center space-x-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-600">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 relative flex flex-col bg-slate-50/20 overflow-hidden">
                    {newMessagesCount > 0 && (
                      <button 
                        onClick={scrollToBottom}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 z-20 animate-bounce hover:bg-green-700 transition-all"
                      >
                         <ChevronDown size={14} />
                         {newMessagesCount} New Messages
                      </button>
                    )}

                    <div 
                      className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
                      ref={messagesContainerRef}
                      onScroll={handleScroll}
                    >
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full opacity-30">
                        <MessageSquare size={48} className="text-slate-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Messages Yet</h3>
                        <p className="text-gray-500">Start the conversation by sending a message.</p>
                      </div>
                    )}

                    {messages.map((message, index) => {
                      const isMedicalOfficer = message.senderType === 'medical_officer';
                      const showDate = index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                      return (
                        <div key={message._id || index}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="bg-gray-200 text-gray-600 text-[10px] px-3 py-1 rounded-full uppercase font-black">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <MessageBubble 
                            message={message} 
                            isMe={isMedicalOfficer} 
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                  {/* Message Input */}
                  <div className="p-4 bg-white border-t border-gray-100">
                    <ChatInput 
                      onSendMessage={onSendMessage} 
                      loading={loading} 
                      placeholder="Type your medical advice here..." 
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-green-50/40">
                  <div className="text-center">
                    <div className="text-6xl text-green-300 mb-4 animate-bounce">👨‍⚕️</div>
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Select a Conversation</h3>
                    <p className="text-green-600">
                      Choose a user from the list to view and respond to their messages.
                    </p>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
  );
};

export default MedicalOfficerChatPage;


