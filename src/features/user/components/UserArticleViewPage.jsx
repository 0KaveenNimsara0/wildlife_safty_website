import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../config/constants';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Tag, 
  Bookmark,
  Share2,
  FileText
} from 'lucide-react';

export default function UserArticleViewPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      // For users, we use the public articles endpoint but we might want to check permissions later
      const response = await fetch(`${BASE_URL}/articles/${articleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setArticle(data.article);
      } else {
        setError('Article not found');
      }
    } catch (err) {
      setError('Failed to load article content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex flex-col items-center justify-center space-y-4 opacity-30">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Loading Article...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen py-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
          <FileText size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Oops! Article Missing</h2>
        <p className="text-slate-500 font-medium mb-8 max-w-md">{error || 'We could not find the article you are looking for.'}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-3"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      {/* Back Navigation */}
      <button 
        onClick={() => navigate(-1)}
        className="group mb-12 flex items-center gap-3 text-slate-400 hover:text-emerald-600 transition-all"
      >
        <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-emerald-50 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Saved Articles</span>
      </button>

      {/* Article Header Section */}
      <div className="space-y-8 mb-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/10">
            {article.category?.replace(/_/g, ' ') || 'Wildlife Research'}
          </span>
          <span className="px-4 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
            Verified Content
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-slate-950/20">
              {article.author?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Contributor</p>
              <p className="text-sm font-bold text-slate-900">{article.author?.name || 'Academic Expert'}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-100 hidden md:block" />

          <div className="flex items-center gap-3 text-slate-400">
            <Clock size={18} />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-0.5 text-slate-400">Release Date</p>
              <p className="text-sm font-bold text-slate-900">
                {new Date(article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Image */}
      {(article.image_url || article.images?.[0]?.url) && (
        <div className="mb-16 relative aspect-[21/9] rounded-[48px] overflow-hidden shadow-2xl">
          <img 
            src={article.image_url || article.images?.[0]?.url} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Article Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 flex flex-col">
          <div className="pt-4 border-t-4 border-emerald-500 w-24 mb-12">
            {article.content && (article.content.includes('<') && article.content.includes('>')) ? (
              <div 
                className="text-xl font-medium text-slate-700 leading-loose space-y-8"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <div className="text-xl font-medium text-slate-700 leading-loose space-y-8 whitespace-pre-wrap">
                {article.content}
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-12 border-t border-slate-100 flex flex-wrap gap-3 mt-12">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mr-2">
                <Tag size={12} /> Keywords:
              </span>
              {article.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-[9px] font-bold uppercase tracking-widest cursor-default transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-12">
          <div className="p-8 rounded-[40px] bg-slate-50 border border-slate-100">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 mb-6">User Archive</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-600">
                 <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500 shadow-sm">
                    <Bookmark size={20} />
                 </div>
                 <div className="text-[10px] font-bold uppercase tracking-widest">
                    Saved in your personal library
                 </div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                 <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-sky-500 shadow-sm">
                    <Share2 size={20} />
                 </div>
                 <div className="text-[10px] font-bold uppercase tracking-widest">
                    Shared with Community Hub
                 </div>
              </div>
            </div>
          </div>

          <div className="p-10 rounded-[48px] bg-slate-900 text-white shadow-2xl shadow-slate-900/20">
             <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-emerald-500 opacity-80">Educational Disclaimer</h4>
             <p className="text-xs font-medium leading-relaxed opacity-90 italic">
                Articles provided in this portal are for informational purposes. Always consult local guidelines or experts for wildlife management decisions.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
