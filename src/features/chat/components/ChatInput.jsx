import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatInput = ({ onSendMessage, loading, placeholder = "Type a message..." }) => {
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    const input = inputRef.current;
    if (input) { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 144)}px`; }
  }, [newMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading || sending) return;
    const draft = newMessage;
    setSending(true);
    try {
      const sent = await onSendMessage(draft.trim());
      if (sent !== false) setNewMessage(current => current === draft ? '' : current);
    } catch { /* Keep the draft for retry; parent displays the error. */ }
    finally { setSending(false); }
  };

  return (
    <div className="shrink-0 border-t border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10">
        <textarea
          ref={inputRef}
          rows={1}
          aria-label="Message"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); handleSubmit(e); } }}
          placeholder={placeholder}
          disabled={loading || sending}
          className="min-h-11 max-h-36 flex-1 min-w-0 resize-none bg-transparent px-3 py-3 text-base leading-5 text-slate-900 placeholder:text-slate-500 focus:outline-none disabled:opacity-60"
        />
        <button type="submit" aria-label={sending ? 'Sending message' : 'Send message'} title="Send message"
          disabled={!newMessage.trim() || loading || sending}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors">
          {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
          <span className="hidden sm:inline">{sending ? 'Sending' : 'Send'}</span>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;

