import React, { useState } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';

const ChatInput = ({ onSendMessage, loading, placeholder = "Type a message..." }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  return (
    <div className="px-8 py-6 bg-white border-t border-slate-50 sticky bottom-0">
      <form onSubmit={handleSubmit} className="flex gap-4">
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center text-slate-300 group-focus-within:text-emerald-500 transition-colors">
             <MessageSquare size={16} />
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={placeholder}
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
  );
};

export default ChatInput;

