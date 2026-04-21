import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/constants';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle,
  MoreVertical,
  ChevronRight,
  Shield,
  ExternalLink
} from 'lucide-react';
import ArticlePreviewModal from '../../../components/common/ArticlePreviewModal';

export default function AdminArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/articles?page=${currentPage}&limit=10`, {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article? This action is permanent and logged.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      alert('Article deleted successfully');
      fetchArticles();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete article');
    }
  };

  const handlePreview = (article) => {
    setSelectedArticle(article);
    setIsPreviewOpen(true);
  };

  const filteredArticles = articles.filter(article =>
    article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-emerald-500 transition-colors">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search Intel Hub: Titles, Authors, or Categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm font-black uppercase tracking-widest text-slate-800 placeholder:text-slate-300 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-5 py-3.5 bg-slate-900 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-900/10">
              <FileText size={16} className="text-emerald-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{articles.length} Intel Nodes</span>
           </div>
           <button className="p-3.5 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 transition-all hover:shadow-lg active:scale-95">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl shadow-sm animate-shake">
          <AlertCircle className="w-5 h-5 mr-3 text-rose-500" />
          <span className="text-sm font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      <div className="card-premium overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4 opacity-30">
             <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Intel Database...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <Shield className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No Intelligence Records Found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Article Information</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Classification</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tactical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredArticles.map((article) => (
                  <tr key={article._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-900 border-4 border-slate-100 overflow-hidden flex-shrink-0">
                             {article.image_url ? (
                               <img src={article.image_url} alt="" className="w-full h-full object-cover opacity-80" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center text-white font-black text-lg">
                                  {article.title?.charAt(0)}
                               </div>
                             )}
                          </div>
                          <div className="min-w-0">
                             <div className="text-sm font-black text-slate-900 tracking-tight truncate max-w-xs">{article.title}</div>
                             <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">By {article.author?.role || 'System'}</span>
                                <span className="text-slate-200 text-[8px]">•</span>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{article.author?.name}</span>
                             </div>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-300" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                             {new Date(article.createdAt).toLocaleDateString('en-US', {
                               month: 'short', day: 'numeric', year: 'numeric'
                             })}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                       <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200">
                          {article.category || 'GENERAL_INTEL'}
                       </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handlePreview(article)}
                            className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl shadow-sm transition-all active:scale-95"
                          >
                             <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(article._id)} className="p-2.5 bg-white border border-slate-100 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
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
               className="relative inline-flex items-center px-4 py-3 rounded-l-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-5 py-3 border text-[10px] font-black uppercase tracking-widest transition-all ${
                  page === currentPage
                    ? 'z-10 bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                    : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
               disabled={currentPage === totalPages}
               className="relative inline-flex items-center px-4 py-3 rounded-r-2xl border border-slate-100 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      <ArticlePreviewModal 
        article={selectedArticle}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        actionButton={
          <button 
            onClick={() => window.open(`/articles/${selectedArticle?._id}`, '_blank')}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
          >
            <ExternalLink size={14} />
            Deep Scan Review
          </button>
        }
      />
    </div>
  );
}
