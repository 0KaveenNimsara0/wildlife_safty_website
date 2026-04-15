import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  Filter,
  FileCheck,
  Zap,
  Clock,
  ExternalLink,
  MoreVertical
} from 'lucide-react';

export default function AdminArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchArticles();
  }, [currentPage, navigate, statusFilter]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const endpoint = statusFilter === 'all'
        ? `http://localhost:5000/api/admin/articles?page=${currentPage}&limit=20`
        : `http://localhost:5000/api/admin/articles/status/${statusFilter}?page=${currentPage}&limit=20`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to approve article');
      }

      const data = await response.json();
      alert('Article approved successfully!');
      fetchArticles(); // Refresh articles
    } catch (error) {
      console.error('Error approving article:', error);
      alert('Failed to approve article');
    }
  };

  const handleRejectArticle = async (articleId) => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rejectionReason })
      });

      if (!response.ok) {
        throw new Error('Failed to reject article');
      }

      const data = await response.json();
      alert('Article rejected successfully!');
      fetchArticles(); // Refresh articles
    } catch (error) {
      console.error('Error rejecting article:', error);
      alert('Failed to reject article');
    }
  };

  const handleCancelPending = async (articleId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}/cancel-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel pending review');
      }

      const data = await response.json();
      alert('Pending review cancelled, article reverted to draft');
      fetchArticles();
    } catch (error) {
      console.error('Error cancelling pending review:', error);
      alert('Failed to cancel pending review');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      alert('Article deleted successfully!');
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleUnpublishArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}/unpublish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to unpublish article');
      }

      const data = await response.json();
      alert('Article unpublished successfully!');
      fetchArticles();
    } catch (error) {
      console.error('Error unpublishing article:', error);
      alert('Failed to unpublish article');
    }
  };

  const handlePublishArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}/publish`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to publish article');
      }

      const data = await response.json();
      alert('Article published successfully!');
      fetchArticles();
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Failed to publish article');
    }
  };

  const handleReReviewArticle = async (articleId) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/admin/articles/${articleId}/re-review`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to send article for re-review');
      }

      const data = await response.json();
      alert('Article sent for re-review successfully!');
      fetchArticles();
    } catch (error) {
      console.error('Error sending article for re-review:', error);
      alert('Failed to send article for re-review');
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
    <div className="space-y-10 animate-fade-in text-slate-900">
      {/* Intel Hub Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black tracking-tight uppercase">Intel <span className="text-emerald-400">Hub</span></h1>
              <div className="px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Knowledge Network</span>
              </div>
           </div>
           <p className="text-slate-400 font-medium text-sm">Reviewing and curating strategic wildlife protection research.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 appearance-none shadow-sm transition-all"
              >
                <option value="all">ALL INTEL</option>
                <option value="pending">PENDING REVIEW</option>
                <option value="approved">APPROVED ONLY</option>
                <option value="published">LIVE BROADCASTS</option>
                <option value="rejected">REJECTED FILES</option>
              </select>
          </div>
        </div>
      </div>
      {error && (
        <div className="mb-6 flex items-center bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl shadow-sm">
          <AlertCircle className="w-5 h-5 mr-3 text-rose-500" />
          <span className="text-sm font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      {/* Intel Table */}
      <div className="card-premium overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-30">
             <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Retrieving Archive Data...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Research Profile</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source / Author</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status Code</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Timestamp</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tactical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {articles.map((article) => (
                  <tr key={article._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border-4 border-slate-100 flex items-center justify-center text-white font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                             {article.title ? article.title.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div className="max-w-[240px]">
                             <div className="text-sm font-black text-slate-900 tracking-tight truncate">{article.title}</div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1 truncate">
                                {article.content?.substring(0, 40)}...
                             </p>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="text-xs font-black text-slate-700 tracking-tight uppercase">{article.author?.name || 'Unknown Author'}</div>
                       <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{article.author?.email}</div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 w-fit
                          ${article.status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            article.status === 'rejected' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                            'bg-amber-50 border-amber-100 text-amber-600'}
                       `}>
                          <div className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500 animate-pulse' : article.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{article.status.replace('_', ' ')}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-300" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(article.createdAt)}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {article.status === 'pending' || article.status === 'pending_review' ? (
                            <button onClick={() => handleApproveArticle(article._id)} className="p-2.5 bg-white border border-slate-100 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
                               <CheckCircle size={16} />
                            </button>
                          ) : article.status === 'approved' ? (
                            <button onClick={() => handlePublishArticle(article._id)} className="p-2.5 bg-white border border-slate-100 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
                               <Zap size={16} />
                            </button>
                          ) : (
                            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-500 rounded-xl shadow-sm transition-all active:scale-95">
                               <Eye size={16} />
                            </button>
                          )}
                          <button onClick={() => handleDeleteArticle(article._id)} className="p-2.5 bg-white border border-slate-100 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
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

    {/* Pagination */}
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

