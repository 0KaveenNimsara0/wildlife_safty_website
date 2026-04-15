import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Loader2, 
  User,
  Clock,
  Shield,
  Search,
  Check,
  CheckCheck
} from 'lucide-react';

const MedicalOfficerUserChat = ({
  conversations,
  currentConversation,
  messages,
  onConversationSelect,
  onSendMessage,
  loading,
  error,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim() && currentConversation) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredConversations = (conversations || []).filter(conv => {
    const name = conv.user?.displayName || conv.user?.email || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="glass card-premium h-[700px] flex overflow-hidden rounded-[2rem] border border-slate-100 shadow-2xl">
      {/* Signal Inbox - Left Sidebar */}
      <div className="w-[280px] border-r border-slate-100 flex flex-col bg-slate-50/20">
        <div className="p-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-1">Signals</h2>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Filter nodes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/50 border border-slate-100 rounded-xl text-xs focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/30 transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1 pb-6">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => onConversationSelect(conv)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 relative group ${
                  currentConversation?._id === conv._id
                    ? 'bg-white shadow-lg shadow-emerald-900/5 border border-slate-50'
                    : 'hover:bg-white/40'
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black shadow-inner ${
                    currentConversation?._id === conv._id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {conv.user?.displayName?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="text-xs font-black text-slate-800 truncate pr-2 tracking-tight">
                      {conv.user?.displayName || conv.user?.email || 'Unknown Node'}
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate font-medium tracking-tight">
                    {conv.lastMessage?.message || 'Ready for uplink...'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <div className="bg-emerald-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="py-20 text-center opacity-40">
              <MessageSquare className="mx-auto mb-4 text-slate-300" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zero Inbound Signals</p>
            </div>
          )}
        </div>
      </div>

      {/* Primary Uplink - Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {currentConversation ? (
          <>
            {/* Tactical Header */}
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
                  {currentConversation.user?.displayName?.charAt(0).toUpperCase() || 'P'}
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 leading-tight">
                    {currentConversation.user?.displayName || currentConversation.user?.email}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">Secure Comm-Link Enabled</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Signal Integrity</p>
                  <p className="text-[10px] font-black text-emerald-500">OPTIMAL (100%)</p>
                </div>
                <div className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 hover:text-emerald-500 cursor-pointer transition-colors shadow-sm">
                  <Shield size={18} />
                </div>
              </div>
            </div>

            {/* Signal Stream - Messages Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8 bg-slate-50/20">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-emerald-200 animate-spin" />
                </div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
                      <Clock size={48} className="text-slate-300" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Awaiting historical data...</p>
                    </div>
                  )}
                  {messages.map((message, index) => {
                    const isMedicalOfficer = message.senderType === 'medical_officer';
                    return (
                      <div
                        key={message._id || index}
                        className={`flex ${isMedicalOfficer ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                      >
                        <div className={`max-w-[80%] lg:max-w-md ${isMedicalOfficer ? 'order-2' : ''}`}>
                          <div
                            className={`px-6 py-4 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed ${
                              isMedicalOfficer
                                ? 'bg-slate-900 text-white rounded-tr-none'
                                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-xl shadow-slate-200/50'
                            }`}
                          >
                            {message.message}
                          </div>
                          <div className={`flex items-center gap-2 mt-2 px-1 ${isMedicalOfficer ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                              {formatTime(message.createdAt)}
                            </span>
                            {isMedicalOfficer && (
                              <CheckCheck size={10} className="text-emerald-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Signal Input Unit */}
            <div className="px-10 py-8 bg-white border-t border-slate-50">
              <div className="relative group">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Draft medical dispatch..."
                  rows={1}
                  className="w-full pl-6 pr-16 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none shadow-inner"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 active:scale-95 disabled:bg-slate-200 disabled:scale-100 transition-all shadow-xl shadow-slate-900/10"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-6 mt-4 px-4 opacity-40">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">End-to-End Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Tactical Direct Link</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center text-slate-100 mb-8 animate-pulse">
              <MessageSquare size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Signal Core Offline</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-[280px] text-center leading-relaxed">
              Select an inbound patient transmission from the sidebar to engage.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalOfficerUserChat;
