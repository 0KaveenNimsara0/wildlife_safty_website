import React, { useState, useRef, useEffect } from 'react';
import { Shield, MessageSquare, AlertCircle, XCircle, ChevronDown } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

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
  const lastParticipantRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const lastMessagesLengthRef = useRef(messages.length);

  // Reset new message count when user manually scrolls to bottom
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      if (isAtBottom && newMessagesCount > 0) {
        setNewMessagesCount(0);
      }
    }
  };

  // Scroll to bottom when new messages arrive, but only if user is at bottom or switching chats
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Check if user is near bottom (within 100px)
      const isNearBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
      
      // Determine if this is a fresh selection of a participant
      const isNewChannel = lastParticipantRef.current !== participant?._id;
      
      const hasNewMessages = messages.length > lastMessagesLengthRef.current;

      if (isNewChannel) {
        container.scrollTop = container.scrollHeight;
        setNewMessagesCount(0);
      } else if (hasNewMessages) {
        if (isNearBottom) {
          container.scrollTo({
             top: container.scrollHeight,
             behavior: 'smooth'
          });
          setNewMessagesCount(0);
        } else {
          // User is reading history, increment new messages count
          setNewMessagesCount(prev => prev + (messages.length - lastMessagesLengthRef.current));
        }
      }

      // Update trackers
      lastMessagesLengthRef.current = messages.length;
      if (participant?._id) {
        lastParticipantRef.current = participant._id;
      }
    }
  }, [messages, participant?._id]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setNewMessagesCount(0);
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
                  selectedAdminId === admin._id ? 'bg-slate-900 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-white text-slate-400 border-slate-100'
                }`}>
                   {admin.name.charAt(0).toUpperCase()}
                </div>
                {selectedAdminId === admin._id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,1)]" />
                )}
             </button>
           ))}
        </div>
      )}

      {/* Chat Header */}
      <div className="px-8 py-5 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl translate-y-[-2px] transition-all duration-500 ${participant ? 'bg-indigo-600' : 'bg-slate-300 animate-pulse'}`}>
              {participant?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            {participant && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white shadow-sm" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase truncate max-w-[150px]">
              {participant?.name || 'Awaiting Selection...'}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border italic ${participant ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                  {participant ? (selectedAdminId ? 'Admin Node' : 'Active Connection') : 'Standby Mode'}
               </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end mr-2">
             <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Secured Channel</p>
             <p className="text-[8px] font-bold text-slate-400 uppercase">Latency: <span className="text-emerald-400">Low</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer border border-slate-100">
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

      {/* New Message Indicator */}
      {newMessagesCount > 0 && (
        <button 
          onClick={scrollToBottom}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/40 flex items-center gap-2 z-20 animate-bounce hover:bg-indigo-500 transition-all active:scale-95"
        >
           <ChevronDown size={14} className="stroke-[3px]" />
           {newMessagesCount} New Messages
        </button>
      )}

      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-slate-50/20" 
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
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

              <MessageBubble message={message} isMe={isMe} />
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s] mx-1" />
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
          </div>
        )}
      </div>

      {/* Message Input */}
      <ChatInput 
        onSendMessage={onSendMessage} 
        loading={loading} 
        placeholder={`Transmission: ${participant?.name?.split(' ')[0] || 'Node'}...`} 
      />
    </div>
  );
};

export default ChatInterface;


