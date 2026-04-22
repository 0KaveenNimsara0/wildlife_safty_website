import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Search, ArrowLeft, Award, Book, ExternalLink, Clock } from 'lucide-react';
import ArticlePreviewModal from '../../components/common/ArticlePreviewModal';

const categories = [
  'wildlife_safety',
  'medical_advice',
  'emergency_response',
  'prevention',
  'treatment'
];

const ArticleSelection = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [popupArticle, setPopupArticle] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/articles/category/${selectedCategory}`);
        setArticles(response.data.articles || []);
      } catch (err) {
        setError('Repository connection failed. Catalog unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [selectedCategory]);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openArticlePopup = (article) => {
    setPopupArticle(article);
    setShowPopup(true);
  };

  const closeArticlePopup = () => {
    setShowPopup(false);
    setPopupArticle(null);
  };

  const handleReviewLater = async (article) => {
    if (!article) return;
    try {
      const response = await api.post('/saved-articles', {
        articleId: article._id,
        title: article.title,
        category: article.category || selectedCategory,
        excerpt: article.excerpt
      });
      
      if (response.data.success) {
        alert('Article archived in your mission library.');
      }
      closeArticlePopup();
    } catch (err) {
      console.error('Save failed:', err);
      // Fallback to local storage if API fails
      const currentSaved = JSON.parse(localStorage.getItem('wildsafe_review_later') || '[]');
      if (!currentSaved.find(a => a._id === article._id)) {
        const newItem = {
          _id: article._id,
          title: article.title,
          category: article.category || selectedCategory,
          excerpt: article.excerpt,
          savedAt: new Date().toISOString()
        };
        localStorage.setItem('wildsafe_review_later', JSON.stringify([newItem, ...currentSaved]));
        alert('Saved to local storage (Offline mode).');
      } else {
        alert('Article is already in your library.');
      }
      closeArticlePopup();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-900">
      <header className="grid lg:grid-cols-3 gap-8 pb-8 border-b border-slate-200">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-[10px]">
              <BookOpen size={14} />
              <span>Educational Repository</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Knowledge <span className="text-emerald-600">Base</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-white text-slate-400 border-slate-50 hover:border-emerald-300 hover:text-emerald-600 shadow-sm'
                }`}
              >
                {category.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          
          <p className="text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Access our peer-reviewed library of safety protocols, medical guidance, and species intelligence. Curated by top herpetologists for rapid field response.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
             <button onClick={() => navigate(-1)} className="p-4 bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all active:scale-95">
                <ArrowLeft size={20} />
             </button>
             <div className="relative group flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Query repository..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:outline-none transition-all shadow-sm text-sm"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Archive Size</p>
                <p className="text-xl font-black text-slate-900">{articles.length} <span className="text-[10px] text-slate-400 font-bold">Nodes</span></p>
             </div>
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-xl font-black text-slate-900">Live <span className="text-[10px] text-emerald-500 font-bold">●</span></p>
             </div>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Intelligence Assets</span>
        </div>
      ) : error ? (
        <div className="card-premium p-12 text-center bg-rose-50 border-rose-100">
          <p className="text-rose-700 font-black uppercase tracking-widest text-sm">{error}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article._id}
              onClick={() => openArticlePopup(article)}
              className="card-premium group p-8 flex flex-col justify-between hover:border-emerald-500 hover:bg-emerald-50/10 cursor-pointer transition-all duration-500"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Book size={20} />
                  </div>
                  <Award size={18} className="text-slate-100 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-emerald-900 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 italic">
                    "{article.excerpt}"
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Ref: {article.category}</span>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Access Report</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Standardized Preview Terminal */}
      <ArticlePreviewModal 
        article={popupArticle}
        isOpen={showPopup}
        onClose={closeArticlePopup}
        actionButton={
          <button 
            onClick={() => handleReviewLater(popupArticle)}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-xl transition-all active:scale-95 flex items-center gap-2"
          >
            <Clock size={16} />
            Save For Mission Review
          </button>
        }
      />
    </div>
  );
};

export default ArticleSelection;
