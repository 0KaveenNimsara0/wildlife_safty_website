import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Loader2, AlertCircle, X } from 'lucide-react';
import api from '../../../services/api';

const SavedArticlesSection = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [articlesStatus, setArticlesStatus] = useState({});
  const [articlesVerifying, setArticlesVerifying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('wildsafe_review_later') || '[]');
    setSavedArticles(saved);
    verifyArticles(saved);
  }, []);

  const verifyArticles = async (articles) => {
    if (articles.length === 0) return;
    setArticlesVerifying(true);
    const statuses = {};
    
    try {
      await Promise.all(articles.map(async (art) => {
        try {
          const response = await api.get(`/articles/${art._id}`);
          if (response.data.success && response.data.article) {
            statuses[art._id] = { ...response.data.article, isRemoved: false };
          } else {
            statuses[art._id] = { ...art, isRemoved: true };
          }
        } catch (err) {
          statuses[art._id] = { ...art, isRemoved: true };
        }
      }));
      setArticlesStatus(statuses);
    } finally {
      setArticlesVerifying(false);
    }
  };

  const handleRemoveSavedArticle = (e, id) => {
    e.stopPropagation();
    const updated = savedArticles.filter(a => a._id !== id);
    localStorage.setItem('wildsafe_review_later', JSON.stringify(updated));
    setSavedArticles(updated);
    const newStatuses = { ...articlesStatus };
    delete newStatuses[id];
    setArticlesStatus(newStatuses);
  };

  const openSavedArticle = (articleId) => {
    const art = articlesStatus[articleId];
    if (art && !art.isRemoved) {
      navigate(`/dashboard/articles/${articleId}`);
    }
  };

  return (
    <div className="space-y-10 focus:outline-none">
      <div className="flex items-center justify-between pb-8 border-b border-slate-50">
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Saved Articles</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bookmarks & Guides</p>
        </div>
        {articlesVerifying && (
          <div className="flex items-center gap-2 text-emerald-600 animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Loading...</span>
          </div>
        )}
      </div>

      <div className="grid gap-6">
        {savedArticles.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center space-y-4 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
            <BookOpen size={48} className="text-slate-100" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Your briefing library is empty</p>
          </div>
        ) : (
          savedArticles.map((art) => {
            const status = articlesStatus[art._id];
            const isRemoved = status?.isRemoved;

            return (
              <div 
                key={art._id}
                onClick={() => !isRemoved && openSavedArticle(art._id)}
                className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                  isRemoved 
                    ? 'bg-slate-50 border-slate-100 opacity-80' 
                    : 'bg-white border-slate-50 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 cursor-pointer'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                        isRemoved ? 'bg-slate-200 text-slate-500' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {art.category?.replace(/_/g, ' ') || 'ARTICLE'}
                      </span>
                      {isRemoved && (
                        <span className="bg-rose-100 text-rose-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
                          <AlertCircle size={10} /> Article Removed
                        </span>
                      )}
                    </div>
                    <h4 className={`text-xl font-black tracking-tight ${isRemoved ? 'text-slate-400 line-through' : 'text-slate-900 group-hover:text-emerald-600'}`}>
                      {art.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium line-clamp-1 italic max-w-xl">
                      "{art.excerpt}"
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => handleRemoveSavedArticle(e, art._id)}
                    className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
                    title="Remove from Library"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

            {savedArticles.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center space-y-4 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                <BookOpen size={48} className="text-slate-100" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No saved articles yet</p>
              </div>
            )}
    </div>
  );
};

export default SavedArticlesSection;
