import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, AlertCircle, X } from 'lucide-react';
import api from '../../../services/api';

const SavedArticlesSection = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [articlesStatus, setArticlesStatus] = useState({});
  const [articlesVerifying, setArticlesVerifying] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);

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
      setSelectedArticle(art);
      setShowArticleModal(true);
    }
  };

  return (
    <div className="space-y-10 focus:outline-none">
      <div className="flex items-center justify-between pb-8 border-b border-slate-50">
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Intelligence Library</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bookmarks & Operational Intelligence</p>
        </div>
        {articlesVerifying && (
          <div className="flex items-center gap-2 text-emerald-600 animate-pulse">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Syncing with HQ...</span>
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
                        {art.category?.replace(/_/g, ' ') || 'INTEL'}
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

      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[2000] p-4 animate-fade-in text-slate-900">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border-4 border-white">
            <header className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-1">
                <span className="text-emerald-600 font-black uppercase tracking-widest text-[10px] bg-emerald-50 px-3 py-1 rounded-lg">Briefing Library</span>
                <h2 className="text-4xl font-black tracking-tight uppercase leading-tight mt-2">{selectedArticle.title}</h2>
              </div>
              <button 
                onClick={() => setShowArticleModal(false)}
                className="p-5 bg-white rounded-[2rem] shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 transition-all active:scale-95"
              >
                <X size={28} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-xl font-medium leading-relaxed italic mb-10 border-l-8 border-emerald-500 pl-10">
                  {selectedArticle.excerpt}
                </p>
                <div className="text-slate-800 text-xl leading-[2.2] font-medium whitespace-pre-wrap font-serif">
                  {selectedArticle.content}
                </div>
              </div>
              
              {selectedArticle.images && selectedArticle.images.length > 0 && (
                <div className="mt-12 space-y-8">
                  {selectedArticle.images.map((img, idx) => (
                    <img key={idx} src={img.url} alt="Intel asset" className="w-full rounded-[2.5rem] border-8 border-slate-50" />
                  ))}
                </div>
              )}
            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/80 flex justify-end">
              <button 
                onClick={() => setShowArticleModal(false)}
                className="bg-slate-900 text-white px-12 py-4 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-2xl transition-all"
              >
                Close Library Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedArticlesSection;
