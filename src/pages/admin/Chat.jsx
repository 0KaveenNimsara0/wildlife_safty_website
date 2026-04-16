import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config/constants';
import {
  MessageSquare,
  Search,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  EyeOff,
  Radio,
  Share2,
  MoreVertical,
  Activity
} from 'lucide-react';

export default function AdminChatManagement() {
  const [messages, setMessages] = useState([]);
  const [publishedMessages, setPublishedMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('messages');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    if (activeTab === 'messages') {
      fetchMessages();
    } else {
      fetchPublishedMessages();
    }
  }, [currentPage, navigate, activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/chat/messages?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchPublishedMessages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/chat/published-messages?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch published messages');
      }

      const data = await response.json();
      setPublishedMessages(data.messages);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (error) {
      console.error('Error fetching published messages:', error);
      setError('Failed to load published messages');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishMessage = async (messageId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/chat/publish-message/${messageId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Published Message',
          content: messages.find(m => m._id === messageId)?.message || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to publish message');
      }

      alert('Message published successfully!');
      fetchMessages();
      fetchPublishedMessages();
    } catch (error) {
      console.error('Error publishing message:', error);
      alert('Failed to publish message');
    }
  };

  const handleDeleteMessage = async (messageId, isPublished = false) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = isPublished ? 'published-messages' : 'messages';
      const response = await fetch(`${BASE_URL}/admin/chat/${endpoint}/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      alert('Message deleted successfully!');
      if (isPublished) {
        fetchPublishedMessages();
      } else {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black tracking-tight uppercase">Comms <span className="text-emerald-400">Control</span></h1>
              <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Feedback</span>
              </div>
           </div>
           <p className="text-slate-400 font-medium text-sm">Monitoring and broadcasting critical field communications.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
           {[
             { id: 'messages', label: 'Tactical feed', icon: Radio },
             { id: 'published', label: 'Broadcasts', icon: Share2 }
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-[14px] transition-all duration-300 font-black text-[10px] uppercase tracking-widest
                  ${activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-md border border-slate-200' 
                    : 'text-slate-400 hover:text-slate-600'}
                `}
             >
               <tab.icon size={16} className={activeTab === tab.id ? 'text-emerald-500' : ''} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>
      {error && (
        <div className="mb-6 flex items-center bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 text-rose-500" />
          <span className="text-sm font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      <div className="card-premium overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-30">
             <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Syncing Comms Uplink...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source Identity</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transmission</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Uptime</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tactical Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(activeTab === 'messages' ? messages : publishedMessages).map((message) => (
                  <tr key={message._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border-4 border-slate-100 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                             {(message.sender?.name || message.author?.name || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <div className="text-sm font-black text-slate-900 tracking-tight">{message.sender?.name || message.author?.name || 'Unknown Node'}</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{message.sender?.email || message.author?.email}</div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="text-xs font-bold text-slate-600 leading-relaxed max-w-md line-clamp-2 italic">
                          "{activeTab === 'messages' ? message.message : message.content}"
                       </div>
                       {activeTab === 'published' && <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2">{message.title}</div>}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(message.createdAt)}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {activeTab === 'messages' && (
                            <button onClick={() => handlePublishMessage(message._id)} title="Broadcast Intelligence" className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-100 rounded-xl shadow-sm transition-all active:scale-95">
                               <Radio size={16} />
                            </button>
                          )}
                          <button onClick={() => handleDeleteMessage(message._id, activeTab === 'published')} className="p-2.5 bg-white border border-slate-100 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
                             <Trash2 size={16} />
                          </button>
                          <button className="p-2.5 bg-white border border-slate-100 text-slate-300 rounded-xl hover:text-slate-900 transition-colors">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
               disabled={currentPage === 1}
               className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
               disabled={currentPage === totalPages}
               className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
