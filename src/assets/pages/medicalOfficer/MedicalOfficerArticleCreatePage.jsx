import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Tag, 
  Layers, 
  Image as ImageIcon, 
  Send, 
  AlertTriangle,
  FileEdit,
  Globe
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MedicalOfficerArticleCreatePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validCategories = [
    { value: 'wildlife_safety', label: 'Wildlife Safety' },
    { value: 'medical_advice', label: 'Medical Advice' },
    { value: 'emergency_response', label: 'Emergency Response' },
    { value: 'prevention', label: 'Prevention' },
    { value: 'treatment', label: 'Treatment' }
  ];

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
      const response = await fetch(`${API_BASE_URL}/medical-officer/articles`, {
        method: 'POST',
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
        setError(data.message || 'Transmission failed. Data rejected by server.');
      }
    } catch (err) {
      setError('Signal disruption: Could not contact central servers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header and Back Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link 
              to="/medical-officer/dashboard" 
              className="flex items-center text-slate-500 hover:text-emerald-600 transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Return to Dashboard</span>
            </Link>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-4">
              <FileEdit className="text-emerald-500" size={36} />
              Draft Intelligence Bulletin
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
            <div className="glass card-premium p-8 rounded-[2rem]">
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    <FileText size={14} className="text-emerald-500" />
                    Bulletin Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="input-standard transition-all"
                    placeholder="Enter mission-critical title..."
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    <Globe size={14} className="text-emerald-500" />
                    Core intelligence Content
                  </label>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={12}
                    className="input-standard resize-none transition-all"
                    placeholder="Detailed investigation findings and advice..."
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    <span className="text-emerald-500">#</span>
                    Executive Summary / Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={e => setExcerpt(e.target.value)}
                    rows={3}
                    className="input-standard resize-none transition-all"
                    placeholder="Brief overview for quick reference..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Metadata */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass card-premium p-8 rounded-[2rem]">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                <Tag size={14} className="text-emerald-500" />
                Data Classification
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="input-standard appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select Classification...</option>
                    {validCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Intelligence Tags</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                    className="input-standard"
                    placeholder="snake, bite, venom..."
                  />
                  <p className="mt-2 text-[9px] text-slate-400 font-medium tracking-wide">Separate with commas</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                    <ImageIcon size={14} className="text-emerald-500" />
                    Visual Assets (URLs)
                  </label>
                  <textarea
                    value={images}
                    onChange={e => setImages(e.target.value)}
                    rows={3}
                    className="input-standard resize-none text-[11px]"
                    placeholder="https://image-url-1.com, https://..."
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-sm tracking-widest"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Publishing Intelligence...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Commit Bulletin
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-6 glass border-emerald-100 rounded-[1.5rem] bg-emerald-50/30">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-800 flex items-center gap-2 mb-3">
                <Layers size={14} />
                Publication Protocol
              </h4>
              <p className="text-[10px] text-emerald-700/70 font-medium leading-relaxed">
                By committing this intelligence, you certify that the information provided is medically accurate and adheres to the Wildlife Safety Security Protocols.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalOfficerArticleCreatePage;
