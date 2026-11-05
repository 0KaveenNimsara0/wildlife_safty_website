import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { formatTime } from '../../../utils/formatters';
export default function MessageBubble({ message, isMe, showStatus = true }) {
 const pending = String(message._id || '').startsWith('temp-');
 const status = pending ? 'Sending' : message.isRead ? 'Read' : 'Sent';
 return <div className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
   <div className={`max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-xl shadow-sm ${isMe ? 'bg-emerald-100 rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
     <p className="text-sm text-slate-800 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">{message.message}</p>
     <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-slate-500">
       <time>{formatTime(message.createdAt)}</time>
       {isMe && showStatus && <span aria-label={status} title={status}>{pending ? <Clock size={14}/> : message.isRead ? <CheckCheck size={16} className="text-sky-600"/> : <Check size={16}/>}</span>}
     </div>
   </div>
 </div>;
}
