import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL, IMAGE_BASE_URL } from '../../../config/constants';
import { 
  Plus, 
  Search, 
  FileText, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  Edit3,
  CheckCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import ArticlePreviewModal from '../../../components/common/ArticlePreviewModal';

export default function MedicalArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, [activeTab]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('medicalOfficerToken');
      const endpoint = activeTab === 'my' ? 'my-articles' : '';
      const response = await fetch(`${BASE_URL}/medical-officer/articles/${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles || []);
      }
    } catch (err) {
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (article) => {
    setSelectedArticle(article);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Article <span className="text-indigo-600">Hub</span></h1>
           <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">Medical Research & Help Guides</p>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
              {[
                { id: 'all', label: 'All Articles' },
                { id: 'my', label: 'My Articles' }
              ].map(tab => (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-md border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   {tab.label}
                </button>
              ))}
           </div>
           
           <button 
             onClick={() => navigate('/medical-officer/articles/create')}
             className="px-6 py-4 bg-indigo-600 text-white rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-900/10 hover:bg-indigo-500 transition-all active:scale-95 group"
           >
             <Plus size={18} />
             <span className="text-[10px] font-black uppercase tracking-widest">Add Article</span>
           </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4 opacity-30">
           <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Articles...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {articles.map((article) => (
             <div key={article._id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group">
                <div className="relative h-56 overflow-hidden">
                   {article.image_url ? (
                     <img src={article.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                   ) : (
                     <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                        <FileText size={48} className="text-white opacity-20" />
                     </div>
                   )}
                    <div className="absolute top-5 left-5">
                       <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm border border-white/20">
                          {article.category || 'GUIDELINE'}
                       </span>
                    </div>
                </div>
                
                <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-2">
                          <Clock size={12} className="text-slate-300" />
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                       </div>
                       <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                         article.status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                         article.status === 'pending_review' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                         article.status === 'draft' ? 'bg-slate-50 text-slate-500 border border-slate-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                       }`}>
                         {article.status?.replace('_', ' ')}
                       </span>
                    </div>
                   
                   <h3 className="text-lg font-black text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 uppercase">
                      {article.title}
                   </h3>
                   
                   <p className="text-xs font-medium text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                      {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                   </p>
                   
                   {(article.status === 'rejected' || (article.status === 'draft' && article.rejectionReason)) && (
                     <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                        <AlertCircle size={14} className="text-rose-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                           <p className="text-[8px] font-black text-rose-700 uppercase tracking-widest mb-1">Rejection Reason</p>
                           <p className="text-[10px] font-bold text-rose-600 line-clamp-2 italic leading-tight">"{article.rejectionReason || 'No feedback provided.'}"</p>
                        </div>
                     </div>
                   )}
                   
                   <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-[10px] font-black overflow-hidden shadow-sm">
                            {article.author?.photoURL ? (
                              <img 
                                src={article.author.photoURL.startsWith('/uploads') ? `${IMAGE_BASE_URL}${article.author.photoURL}` : article.author.photoURL} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              article.author?.name?.charAt(0).toUpperCase()
                            )}
                         </div>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{article.author?.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         {activeTab === 'my' && (
                           <button 
                             onClick={(e) => { e.stopPropagation(); navigate(`/medical-officer/articles/edit/${article._id}`); }}
                             className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                           >
                             <Edit3 size={16} />
                           </button>
                         )}
                         <button 
                           onClick={() => handlePreview(article)}
                           className="p-2.5 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                         >
                            <ChevronRight size={16} />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
           ))}
           
           {articles.length === 0 && (
             <div className="col-span-full py-32 text-center opacity-30 select-none">
                <ShieldAlert size={64} className="mx-auto mb-6 text-slate-300" />
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-800">No Articles Found</h3>
                <p className="text-xs font-bold uppercase tracking-widest mt-2">{activeTab === 'my' ? 'Write your first article to share knowledge' : 'There are no published articles to show right now'}</p>
             </div>
           )}
        </div>
      )}

      <ArticlePreviewModal 
        article={selectedArticle}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        actionButton={
          <button 
            onClick={() => { setIsPreviewOpen(false); navigate(`/medical-officer/articles/${selectedArticle?._id}`); }}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
          >
            <ExternalLink size={14} />
            Read Full Article
          </button>
        }
      />
    </div>
  );
}
