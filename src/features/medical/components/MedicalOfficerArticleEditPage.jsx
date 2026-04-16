import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Tag, 
  Layers, 
  Image as ImageIcon, 
  Save, 
  AlertTriangle,
  FileEdit,
  Globe,
  Loader2
} from 'lucide-react';

import { BASE_URL } from '../../../config/constants';

const MedicalOfficerArticleEditPage = () => {
  const { articleId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);

  const navigate = useNavigate();

  const validCategories = [
    { value: 'wildlife_safety', label: 'Wildlife Safety' },
    { value: 'medical_advice', label: 'Medical Advice' },
    { value: 'emergency_response', label: 'Emergency Response' },
    { value: 'prevention', label: 'Prevention' },
    { value: 'treatment', label: 'Treatment' }
  ];

  useEffect(() => {
    const fetchArticle = async () => {
      setLoadingArticle(true);
      try {
        const token = localStorage.getItem('medicalOfficerToken');
        const response = await fetch(`${BASE_URL}/medical-officer/articles/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setTitle(data.article.title || '');
          setContent(data.article.content || '');
          setExcerpt(data.article.excerpt || '');
          setCategory(data.article.category || '');
          setTags((data.article.tags || []).join(', '));
          setImages((data.article.images || []).map(img => typeof img === 'string' ? img : img.url).join(', '));
        } else {
          setError(data.message || 'Error occurred while retrieving article.');
        }
      } catch (err) {
        setError('Connection interrupted. Unable to reach server.');
      } finally {
        setLoadingArticle(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !content.trim() || !category.trim()) {
      setError('Title, content, and category are essential data points.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('medicalOfficerToken');
      const response = await fetch(`${BASE_URL}/medical-officer/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          images: images.split(',').map(url => ({ url: url.trim(), alt: '', caption: '' })).filter(img => img.url)
        })
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/medical-officer/dashboard');
      } else {
        setError(data.message || 'Transmission failed. Update rejected by node.');
      }
    } catch (err) {
      setError('Signal disruption: Update could not be committed.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-black uppercase tracking-widest text-[10px]">Retrieving Intelligence Node...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header and Back Button */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link 
              to="/medical-officer/articles" 
              className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Return to Archive</span>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-4">
               <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                  <FileEdit size={28} />
               </div>
               Edit Medical Article
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-8 glass bg-rose-50 border-rose-200 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertTriangle className="text-rose-500" />
            <p className="text-sm font-bold text-rose-700 uppercase tracking-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <div className="space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all placeholder:text-slate-300"
                    placeholder="Enter article title..."
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">
                    Article Content
                  </label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all placeholder:text-slate-300 resize-none"
                    placeholder="Write detailed medical information and advice..."
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 ml-1">
                    Executive Summary
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all placeholder:text-slate-300 resize-none"
                    placeholder="Brief overview for the dashboard preview..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-6 pb-4 border-b border-slate-50 flex items-center gap-2">
                <Tag size={14} />
                Article Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Primary Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Category...</option>
                    {validCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Navigation Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all"
                    placeholder="wildlife, first aid, venom..."
                  />
                  <p className="mt-2 text-[10px] text-slate-400 font-medium ml-1">Separate with commas</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">
                    Image Assets (URLs)
                  </label>
                  <textarea
                    value={images}
                    onChange={e => setImages(e.target.value)}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all text-xs resize-none"
                    placeholder="https://image-url-1.com, https://..."
                  />
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving Updates...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Update Article
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Layers size={60} />
               </div>
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2 mb-3">
                Guidelines
              </h4>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                Updating this article confirms that the information remains medically accurate and adheres to the latest official safety standards.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalOfficerArticleEditPage;

