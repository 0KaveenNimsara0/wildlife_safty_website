import React from 'react';
import { Check } from 'lucide-react';
import { formatTime } from '../../../utils/formatters';

const MessageBubble = ({ message, isMe, avatar, showStatus = true }) => {
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-3 group mb-2`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden shadow-sm border border-slate-50 flex items-center justify-center text-[10px] font-black text-slate-400">
           {avatar ? (
             <img src={avatar} alt="Sender" className="w-full h-full object-cover" />
           ) : 'U'}
        </div>
      )}
      <div className={`max-w-[80%] lg:max-w-md relative`}>
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
          {isMe && showStatus && (
             <div className="flex items-center">
                <Check size={12} className="text-emerald-500" />
                {message.isRead && <Check size={12} className="text-emerald-500 -ml-2" />}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;

