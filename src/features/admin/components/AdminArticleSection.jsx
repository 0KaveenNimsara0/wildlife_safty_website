import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ExternalLink,
  ArrowLeft,
  User as UserIcon,
  Check,
  X as CloseIcon,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
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
  const [isFullViewOpen, setIsFullViewOpen] = useState(false);
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

  const handleApprove = async (articleId) => {
    if (!window.confirm('Approve and publish this medical article?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/articles/${articleId}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Article published successfully');
        fetchArticles();
      }
    } catch (err) {
      alert('Approval failed');
    }
  };

  const handleReject = async (articleId) => {
    const reason = window.prompt('Enter rejection reason for the Medical Officer:');
    if (!reason) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/articles/${articleId}/reject`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rejectionReason: reason })
      });
      if (response.ok) {
        alert('Article rejected and officer notified');
        fetchArticles();
      }
    } catch (err) {
      alert('Rejection failed');
    }
  };

  const handleUnpublish = async (articleId) => {
    if (!window.confirm('Withdraw this article and revert it to draft? The author will be able to edit it again.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${BASE_URL}/admin/articles/${articleId}/unpublish`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert('Article reverted to draft');
        fetchArticles();
      }
    } catch (err) {
      alert('Operation failed');
    }
  };

  if (isFullViewOpen && selectedArticle) {
    return (
      <div className="space-y-8 animate-fade-in p-2">
        <div className="flex items-center justify-between">
           <button 
             onClick={() => setIsFullViewOpen(false)}
             className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
           >
              <ArrowLeft size={14} />
              Return to Database
           </button>
           <div className="flex gap-3">
              {(selectedArticle.status === 'pending_review' || selectedArticle.status === 'draft') && (
                 <>
                    <button 
                      onClick={() => handleApprove(selectedArticle._id)}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10"
                    >
                       <Check size={14} />
                       Approve Intelligence
                    </button>
                    <button 
                      onClick={() => handleReject(selectedArticle._id)}
                      className="px-6 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all flex items-center gap-2 shadow-lg shadow-rose-900/10"
                    >
                       <CloseIcon size={14} />
                       Reject Report
                    </button>
                 </>
              )}
           </div>
        </div>

        <div className="card-premium bg-white p-12 lg:p-20 rounded-[3rem] border-slate-100 shadow-2xl">
           <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
                    <Shield size={14} />
                    <span>Intelligence Asset: {selectedArticle.category || 'General Intel'}</span>
                 </div>
                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">{selectedArticle.title}</h1>
                 
                 <div className="flex items-center gap-6 pt-4">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 shadow-inner">
                          {selectedArticle.author?.photoURL ? (
                             <img src={selectedArticle.author.photoURL.startsWith('http') ? selectedArticle.author.photoURL : `${IMAGE_BASE_URL}${selectedArticle.author.photoURL}`} alt="" className="w-full h-full object-cover" />
                          ) : (
                             <UserIcon size={16} className="w-full h-full p-2 text-slate-400" />
                          )}
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{selectedArticle.author?.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Authorized Intelligence Source</p>
                       </div>
                    </div>
                    <div className="h-8 w-px bg-slate-100" />
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Clock size={16} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                             {new Date(selectedArticle.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Deployment Timestamp</p>
                       </div>
                    </div>
                 </div>
              </div>

                 <div className="prose prose-slate max-w-none">
                    <p className="text-2xl text-slate-500 font-medium leading-relaxed italic border-l-4 border-emerald-500 pl-10 py-4 bg-slate-50/50 rounded-r-3xl">
                       "{selectedArticle.excerpt || selectedArticle.content?.substring(0, 200)}..."
                    </p>
                    
                    {/* Image Gallery */}
                    <div className="my-16 space-y-8">
                       {selectedArticle.image_url && !selectedArticle.images?.length && (
                          <div className="rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-100">
                             <img 
                               src={selectedArticle.image_url.startsWith('http') ? selectedArticle.image_url : `${IMAGE_BASE_URL}${selectedArticle.image_url}`} 
                               alt="" 
                               className="w-full h-auto" 
                             />
                          </div>
                       )}
                       {selectedArticle.images?.map((img, idx) => (
                          <div key={idx} className="rounded-[2.5rem] overflow-hidden border-8 border-slate-50 shadow-2xl bg-slate-100">
                             <img 
                               src={(typeof img === 'string' ? img : img.url).startsWith('http') ? (typeof img === 'string' ? img : img.url) : `${IMAGE_BASE_URL}${typeof img === 'string' ? img : img.url}`} 
                               alt={img.alt || ''} 
                               className="w-full h-auto" 
                             />
                             {img.caption && (
                               <div className="p-6 bg-white border-t border-slate-50">
                                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{img.caption}</p>
                               </div>
                             )}
                          </div>
                       ))}
                    </div>

                    <div 
                       className="text-slate-800 text-xl leading-[2.2] font-medium whitespace-pre-wrap font-serif"
                       dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                    />
                 </div>
           </div>
        </div>
      </div>
    );
  }

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
                                <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                                   {article.author?.photoURL ? (
                                     <img 
                                       src={article.author.photoURL.startsWith('http') ? article.author.photoURL : `${IMAGE_BASE_URL}${article.author.photoURL}`} 
                                       alt="" 
                                       className="w-full h-full object-cover" 
                                     />
                                   ) : (
                                     <UserIcon size={10} className="w-full h-full p-1 text-slate-400" />
                                   )}
                                </div>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{article.author?.name}</span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded">Expert</span>
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
                       <div className="flex flex-col gap-1.5">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-200 w-fit">
                             {article.category || 'GENERAL_INTEL'}
                          </span>
                          <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg w-fit border ${
                             article.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                             article.status === 'pending_review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                             article.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                             'bg-slate-50 text-slate-400 border-slate-100'
                          }`}>
                             {article.status?.replace('_', ' ')}
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {(article.status === 'pending_review' || article.status === 'draft') && (
                             <>
                                <button 
                                  onClick={() => handleApprove(article._id)}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-95"
                                  title="Approve & Publish"
                                >
                                   <Check size={16} />
                                </button>
                                <button 
                                  onClick={() => handleReject(article._id)}
                                  className="p-2.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl shadow-sm transition-all active:scale-95"
                                  title="Reject with Reason"
                                >
                                   <CloseIcon size={16} />
                                </button>
                             </>
                          )}
                          {(article.status === 'published' || article.status === 'approved') && (
                             <button 
                               onClick={() => handleUnpublish(article._id)}
                               className="p-2.5 bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white rounded-xl shadow-sm transition-all active:scale-95"
                               title="Revert to Draft"
                             >
                                <RotateCcw size={16} />
                             </button>
                          )}
                          <button 
                            onClick={() => handlePreview(article)}
                            className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 rounded-xl shadow-sm transition-all active:scale-95"
                            title="Quick Preview"
                          >
                             <Eye size={16} />
                          </button>
                          <button onClick={() => handleDelete(article._id)} className="p-2.5 bg-white border border-slate-100 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl shadow-sm transition-all active:scale-95">
                             <Trash2 size={16} />
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
          <div className="flex gap-4">
             {selectedArticle?.status === 'pending_review' && (
                <>
                   <button 
                      onClick={() => {
                        handleApprove(selectedArticle?._id);
                        setIsPreviewOpen(false);
                      }}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2"
                   >
                      <Check size={14} />
                      Approve Intelligence
                   </button>
                   <button 
                      onClick={() => {
                        handleReject(selectedArticle?._id);
                        setIsPreviewOpen(false);
                      }}
                      className="px-6 py-3 bg-rose-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all active:scale-95 flex items-center gap-2"
                   >
                      <CloseIcon size={14} />
                      Reject Report
                   </button>
                </>
             )}
             {(selectedArticle?.status === 'published' || selectedArticle?.status === 'approved') && (
                <button 
                  onClick={() => {
                    handleUnpublish(selectedArticle?._id);
                    setIsFullViewOpen(false);
                  }}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
                >
                   <RotateCcw size={14} />
                   Revert to Draft
                </button>
             )}
             <button 
               onClick={() => {
                 setIsPreviewOpen(false);
                 setIsFullViewOpen(true);
               }}
               className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
             >
               <Eye size={14} />
               View Full Detail
             </button>
          </div>
        }
      />
    </div>
  );
}
