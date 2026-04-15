import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Search, ArrowLeft, Award, Book } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const categories = [
  'wildlife_safety',
  'medical_advice',
  'emergency_response',
  'prevention',
  'treatment'
];

const ArticleSelectionPage = () => {
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
        const response = await axios.get(`${API_URL}/articles/category/${selectedCategory}`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-fade-in text-slate-900">
      {/* Premium Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-slate-200">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-[0.2em] text-xs">
            <BookOpen size={16} />
            <span>Educational Repository</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none">
            Knowledge <span className="text-emerald-600">Base</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            Access our peer-reviewed library of safety protocols, medical guidance, and species intelligence.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-fit">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Query repository..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-3xl focus:border-emerald-500 focus:outline-none transition-all shadow-sm"
            />
          </div>
          <button onClick={() => navigate(-1)} className="btn-secondary py-4 px-8 flex items-center justify-center gap-3">
            <ArrowLeft size={20} />
            <span>Return</span>
          </button>
        </div>
      </header>

      {/* Category Navigation */}
      <div className="flex flex-wrap gap-3 pb-4 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                : 'bg-white text-slate-400 border-slate-50 hover:border-emerald-300 hover:text-emerald-600 shadow-sm'
            }`}
          >
            {category.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

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
      {/* Full Content Popup Overlay */}
      {showPopup && popupArticle && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl border-2 border-white flex flex-col relative group">
            {/* Header Area */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-black uppercase tracking-widest text-[10px]">
                  <Award size={14} />
                  <span>Intelligence Report: {popupArticle.category}</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{popupArticle.title}</h2>
              </div>
              <button 
                onClick={closeArticlePopup}
                className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all active:scale-95"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 text-lg font-medium leading-relaxed whitespace-pre-wrap italic mb-10 border-l-4 border-emerald-500 pl-8">
                  {popupArticle.excerpt}
                </p>
                <div className="text-slate-800 text-lg leading-[2] font-medium whitespace-pre-wrap font-serif">
                  {popupArticle.content}
                </div>
              </div>

              {popupArticle.images && popupArticle.images.length > 0 && (
                <div className="mt-12 space-y-6">
                  {popupArticle.images.map((img, idx) => (
                    <div key={idx} className="rounded-[2rem] overflow-hidden border-4 border-slate-50 group-hover:border-emerald-50 transition-colors">
                      <img
                        src={img.url}
                        alt={`Intelligence Asset ${idx + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Interaction Footer */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Identity Verified Source</span>
              <button 
                onClick={closeArticlePopup}
                className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-600 shadow-xl transition-all active:scale-95"
              >
                Dismiss Intelligence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleSelectionPage;

