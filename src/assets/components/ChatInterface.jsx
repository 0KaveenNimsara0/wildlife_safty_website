import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Shield, Clock, CheckCircle2, AlertCircle, Loader2, XCircle } from 'lucide-react';

const ChatInterface = ({ 
  participant, 
  messages, 
  onSendMessage, 
  loading, 
  error, 
  onClearError,
  admins = [],
  selectedAdminId = null,
  onAdminSelect,
  currentSenderId = null
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');
    await onSendMessage(messageToSend);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative rounded-[28px] border border-slate-100 shadow-2xl overflow-hidden">
      {/* Node Selector Row (Optional) */}
      {admins.length > 0 && (
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3 overflow-x-auto no-scrollbar">
           <div className="flex items-center gap-1.5 mr-2">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">Admin Nodes</p>
           </div>
           {admins.filter(a => a && a._id).map(admin => (
             <button
               key={admin._id}
               onClick={() => onAdminSelect(admin)}
               className={`relative shrink-0 transition-all duration-300 ${selectedAdminId === admin._id ? 'scale-110' : 'opacity-40 hover:opacity-100 scale-90'}`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border-2 transition-all ${
                  selectedAdminId === admin._id ? 'bg-slate-900 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-white text-slate-400 border-slate-100'
                }`}>
                   {admin.name.charAt(0).toUpperCase()}
                </div>
                {selectedAdminId === admin._id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)]" />
                )}
             </button>
           ))}
        </div>
      )}

      {/* Chat Header */}
      <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl translate-y-[-2px] transition-all duration-500 ${selectedAdminId ? 'bg-emerald-600' : 'bg-slate-300 animate-pulse'}`}>
              {participant?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            {selectedAdminId && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-sm" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[150px]">
              {participant?.name || 'Awaiting Selection...'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border italic ${selectedAdminId ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                  {selectedAdminId ? 'Admin Node' : 'Standby Mode'}
               </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
             <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Secured Channel</p>
             <p className="text-[8px] font-bold text-slate-400 uppercase">Latency: <span className="text-emerald-400">Low</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer border border-slate-100">
             <Shield size={18} />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-rose-50 border-y border-rose-100 p-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-rose-500" size={18} />
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{error}</p>
            </div>
            <button
              onClick={onClearError}
              className="p-2 text-rose-400 hover:text-rose-600 transition-colors"
            >
              <XCircle size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50/20" ref={messagesContainerRef}>
        {messages.length === 0 && !loading && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 space-y-4">
            <MessageSquare size={64} className="text-slate-200" />
            <div className="text-center">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Encrypted Channel Established</h3>
               <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">Waiting for data transmission...</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const isMe = message.senderId === currentSenderId || (message.senderType === 'medical_officer' && !currentSenderId);
          const showDate = index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

          return (
            <div key={message._id || index} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {showDate && (
                <div className="flex items-center gap-4 my-12 opacity-40">
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    {formatDate(message.createdAt)}
                  </span>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                </div>
              )}

              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group mb-2`}>
                <div className={`max-w-[80%] lg:max-w-md relative ${isMe ? 'order-1' : 'order-1'}`}>
                  <div className={`px-6 py-4 rounded-3xl shadow-sm text-sm font-medium leading-relaxed ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-xl shadow-slate-200/50'
                  }`}>
                    {message.message}
                  </div>
                  
                  <div className={`flex items-center gap-2 mt-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                       {formatTime(message.createdAt)}
                    </span>
                    {isMe && (
                       <div className="flex items-center gap-0.5">
                          <CheckCircle2 size={8} className="text-emerald-500" />
                          {message.isRead && <CheckCircle2 size={8} className="text-emerald-500 -ml-1" />}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-1" />
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="px-8 py-6 bg-white border-t border-slate-50 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex gap-4">
          <div className="flex-1 relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-emerald-500 transition-colors">
               <MessageSquare size={16} />
            </div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Transmission: ${participant?.name?.split(' ')[0] || 'Node'}...`}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs font-black uppercase tracking-widest text-slate-800 placeholder:text-slate-300 transition-all"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="px-8 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center gap-3 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send Intel</span>
                <Send size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
