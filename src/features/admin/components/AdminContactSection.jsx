import React, { useState, useEffect, useRef } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  XCircle, 
  User, 
  Mail, 
  Clock, 
  ChevronRight,
  ShieldAlert,
  Loader2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { BASE_URL } from '../../../config/constants';

const AdminContactSection = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const url = filterStatus === 'all' 
        ? `${BASE_URL}/contact/admin/tickets` 
        : `${BASE_URL}/contact/admin/tickets?status=${filterStatus}`;
        
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTicket = async (ticket) => {
    try {
      const response = await fetch(`${BASE_URL}/contact/admin/tickets/${ticket._id}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
      }
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    try {
      setSendingReply(true);
      const response = await fetch(`${BASE_URL}/contact/admin/tickets/${selectedTicket._id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ message: replyMessage })
      });

      const data = await response.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
        setReplyMessage('');
        // Update ticket in list too
        setTickets(tickets.map(t => t._id === data.ticket._id ? data.ticket : t));
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
    } finally {
      setSendingReply(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!window.confirm('Are you sure you want to resolve and archive this ticket?')) return;

    try {
      const response = await fetch(`${BASE_URL}/contact/admin/tickets/${selectedTicket._id}/close`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedTicket(data.ticket);
        setTickets(tickets.map(t => t._id === data.ticket._id ? data.ticket : t));
      }
    } catch (error) {
      console.error('Failed to close ticket:', error);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-140px)] flex gap-8 animate-fade-in">
      
      {/* Sidebar: Ticket List */}
      <div className="w-[400px] flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/30">
           <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3">
                 <Inbox className="text-emerald-500" size={20} />
                 Terminal <span className="text-emerald-500">Inbound</span>
              </h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200 shadow-sm">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{tickets.length} Nodes</span>
              </div>
           </div>

           <div className="space-y-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   type="text" 
                   placeholder="Filter by subject or node..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-11 pr-4 py-3.5 bg-white rounded-2xl border border-slate-100 focus:border-emerald-500 focus:outline-none text-[10px] font-black uppercase tracking-widest placeholder:text-slate-300 transition-all shadow-inner" 
                 />
              </div>

              <div className="flex gap-2">
                 {['all', 'open', 'closed'].map(status => (
                   <button
                     key={status}
                     onClick={() => setFilterStatus(status)}
                     className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                       filterStatus === status 
                         ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                         : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                     }`}
                   >
                     {status}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Loader2 size={32} className="animate-spin text-emerald-600 mb-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synchronizing Stream...</span>
             </div>
           ) : filteredTickets.length === 0 ? (
             <div className="text-center py-20 opacity-40">
                <ShieldAlert size={48} className="mx-auto mb-4 text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No signals found</p>
             </div>
           ) : (
             filteredTickets.map((ticket) => (
               <button
                 key={ticket._id}
                 onClick={() => handleSelectTicket(ticket)}
                 className={`w-full flex items-start gap-4 p-5 rounded-3xl transition-all duration-300 border ${
                   selectedTicket?._id === ticket._id 
                     ? 'bg-emerald-50 border-emerald-100 shadow-lg' 
                     : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                 }`}
               >
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    ticket.status === 'open' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                 }`}>
                    {ticket.status === 'open' ? <MessageSquare size={20} /> : <CheckCircle2 size={20} />}
                 </div>
                 <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                       </span>
                       <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    </div>
                    <h3 className="text-xs font-black text-slate-900 tracking-tight truncate mb-1">
                       {ticket.subject}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 truncate">
                       {ticket.name}
                    </p>
                 </div>
               </button>
             ))
           )}
        </div>
      </div>

      {/* Main Area: Ticket Details & Thread */}
      <div className="flex-1 flex flex-col bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative">
        {selectedTicket ? (
          <>
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md z-10">
               <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                    selectedTicket.status === 'open' ? 'bg-emerald-500' : 'bg-slate-900'
                  }`}>
                     <User size={24} />
                  </div>
                  <div>
                     <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1">{selectedTicket.subject}</h3>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                           <Mail size={12} className="text-slate-400" />
                           <span className="text-[10px] font-bold text-slate-500">{selectedTicket.email}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="flex items-center gap-2">
                           <Clock size={12} className="text-slate-400" />
                           <span className="text-[10px] font-bold text-slate-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  {selectedTicket.status === 'open' && (
                    <button 
                      onClick={handleCloseTicket}
                      className="px-6 py-3 rounded-2xl bg-white border-2 border-emerald-500 text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center gap-2"
                    >
                       <CheckCircle2 size={14} />
                       Resolve Node
                    </button>
                  )}
                  <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] ${
                    selectedTicket.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {selectedTicket.status}
                  </div>
               </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-8 bg-slate-50/30" ref={scrollRef}>
               
               {/* Original Message */}
               <div className="flex gap-4 items-start max-w-3xl">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm flex-shrink-0">
                     <User size={18} className="text-slate-400" />
                  </div>
                  <div className="flex-1">
                     <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border border-slate-100 shadow-sm relative">
                        <div className="absolute top-0 left-0 w-4 h-4 bg-white border-l border-t border-slate-100 -translate-x-2 -translate-y-2 rotate-45" />
                        <p className="text-sm font-medium text-slate-700 leading-relaxed">
                           {selectedTicket.message}
                        </p>
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-4 mt-2 inline-block">
                        Initial Transmission • {selectedTicket.name}
                     </span>
                  </div>
               </div>

               {/* Replies */}
               {selectedTicket.replies.map((reply, idx) => (
                  <div key={idx} className={`flex gap-4 items-start max-w-3xl ${reply.sender === 'admin' ? 'ml-auto flex-row-reverse' : ''}`}>
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                       reply.sender === 'admin' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-400'
                     }`}>
                        {reply.sender === 'admin' ? <Lock size={16} /> : <User size={18} />}
                     </div>
                     <div className={`flex-1 ${reply.sender === 'admin' ? 'text-right' : ''}`}>
                        <div className={`p-6 rounded-[2rem] border shadow-sm relative ${
                          reply.sender === 'admin' 
                            ? 'bg-slate-900 text-white border-slate-900 rounded-tr-none' 
                            : 'bg-white text-slate-700 border-slate-100 rounded-tl-none'
                        }`}>
                           <p className="text-sm font-medium leading-relaxed">
                              {reply.message}
                           </p>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 mx-4 mt-2 inline-block">
                           {reply.sender === 'admin' ? 'Administrative Directive' : 'Client Response'} • {new Date(reply.createdAt).toLocaleTimeString()}
                        </span>
                     </div>
                  </div>
               ))}
            </div>

            {/* Reply Input or Status Message */}
            <div className="p-8 bg-white border-t border-slate-100">
               {selectedTicket.status === 'open' ? (
                 <form onSubmit={handleSendReply} className="relative group">
                    <textarea 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Enter administrative directive to be transmitted via email..."
                      className="w-full px-8 py-6 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner resize-none pr-32"
                      rows="3"
                    />
                    <button 
                      type="submit"
                      disabled={sendingReply || !replyMessage.trim()}
                      className="absolute bottom-4 right-4 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                       {sendingReply ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                       Transmit
                    </button>
                 </form>
               ) : (
                 <div className="flex flex-col items-center justify-center py-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                    <Lock size={24} className="text-slate-300 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Communication Node Terminated</p>
                    <p className="text-[9px] font-bold text-slate-300 mt-1 italic">This ticket is archived and read-only.</p>
                 </div>
               )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl" />
             
             <div className="relative z-10">
                <div className="w-32 h-32 rounded-[40px] bg-white shadow-2xl flex items-center justify-center mb-8 border border-slate-100 mx-auto">
                   <Inbox size={48} className="text-emerald-500 opacity-20" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800 mb-4">Command Post Standby</h3>
                <p className="text-xs font-bold text-slate-400 max-w-sm mx-auto leading-relaxed uppercase tracking-[0.15em]">
                   Select an active support signal from the transmission feed to initiate an administrative review.
                </p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactSection;
